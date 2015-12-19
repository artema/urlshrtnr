var AWS = require('aws-sdk'),
    bunyan = require('bunyan'),
    config = require('./config'),
    pkg = require('../package.json');

let consoleStream = { level: 'debug', stream: process.stdout };

var applicationStreams = [ consoleStream ],
    awsStreams = [ consoleStream ];

var loggers = {
  application: bunyan.createLogger({
    name: pkg.name,
    streams: applicationStreams
  }),
  aws: bunyan.createLogger({
    name: 'aws',
    streams: awsStreams
  })
};

AWS.config.logger = {
  log: (line) => {
    loggers.aws.debug({}, line);
  }
};

module.exports = loggers.application;
