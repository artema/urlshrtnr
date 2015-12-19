var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'me'});
AWS.config.credentials = credentials;

require('babel/register');
require('./server');
