var bunyan = require('bunyan'),
    pkg = require('../package.json');

var consoleStream = { level: 'debug', stream: process.stdout };

module.exports = bunyan.createLogger({
  name: pkg.name,
  streams: [ consoleStream ]
});
