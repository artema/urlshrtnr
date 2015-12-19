var handlers = require('./handlers'),
    logger = require('./logger'),
    Promise = require('bluebird');

logger.debug({}, 'Starting the application...');

function handle(name, payload) {
  logger.debug({ handler: name, request: payload }, 'Handling request...');

  let handler = handlers[name];

  if (!handler) {
    return Promise.reject(`Handler not found: ${name}`);
  }

  return handler(payload);
}

function success(context) {
  return function(payload) {
    logger.debug({ response: payload }, 'Handling response...');

    context.succeed(payload || {});
  };
}

function fail(context) {
  return function(error) {
    logger.error({ error: error }, 'Handling failure...');

    context.fail(error);
  };
}

exports.handler = function(event, context) {
  logger.debug({ event: event, context: context }, 'Lambda request started.');

  handle(event.Handler, event.Body)
    .then(success(context))
    .catch(fail(context));
}
