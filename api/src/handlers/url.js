var config = require('../config'),
    logger = require('../logger'),
    AWS = require('aws-sdk'),
    http = require('request'),
    moment = require('moment'),
    Promise = require('bluebird');

var db = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient({ region: config.region }));

module.exports.read = async function(request) {
  logger.debug({ request: request }, 'url-read request.');

  if (!request.hash) {
    logger.warn({ param: 'hash', value: request.hash }, 'Missing hash.');
    return {
      status: 'error',
      body: {
        param: 'hash',
        reason: 'invalid'
      }
    };
  }

  let payload = (await db.getAsync({
    TableName: config.dynamodb.urls,
    Key: {
      hash: request.hash
    }
  })).Item;

  if (!payload) {
    logger.warn({ param: 'hash', value: request.hash }, 'Hash not found.');
    return {
      status: 'error',
      body: {
        param: 'hash',
        reason: 'notfound'
      }
    };
  }

  payload.used += 1;

  try {
    await db.putAsync({
      TableName: config.dynamodb.urls,
      Item: payload
    });
  }
  catch(e) {
    logger.warn({ error: e }, 'Unable to update URL usage count.');
  }

  return {
    status: 'ok',
    body: payload
  };
};

module.exports.create = async function(request) {
  logger.debug({ request: request }, 'url-create request.');

  if (!request.url || !await validateUrl(request.url)) {
    logger.warn({ param: 'url', value: request.hash }, 'Missing or invalid URL.');
    return {
      status: 'error',
      body: {
        param: 'url',
        reason: 'invalid'
      }
    };
  }

  if (request.hash) {
    if (!/^[A-Za-z0-9]{4,32}$/.test(request.hash)) {
      logger.warn({ param: 'hash', value: request.hash }, 'Invalid hash.');
      return {
        status: 'error',
        body: {
          param: 'hash',
          reason: 'invalid'
        }
      };
    }

    let existing = (await db.getAsync({
      TableName: config.dynamodb.urls,
      Key: {
        hash: request.hash
      }
    })).Item;

    if (existing) {
      return {
        status: 'error',
        body: {
          param: 'hash',
          reason: 'exists'
        }
      };
    }
  }
  else {
    request.hash = generateHash();
  }

  await db.putAsync({
    TableName: config.dynamodb.urls,
    Item: {
      hash: request.hash,
      url: request.url,
      created: moment().format(),
      used: 0
    }
  });

  return {
    status: 'ok',
    body: {
      hash: request.hash
    }
  };
};

async function validateUrl(url) {
  return new Promise((resolve, reject) => {
    http(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        return resolve(true);
      }

      resolve(false);
    });
  });
}

function generateHash() {
  return Math.random().toString(36).substr(2,8);
}
