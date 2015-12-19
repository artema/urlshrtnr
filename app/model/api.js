var Swagger = require('swagger-client');

module.exports = {
  getClient: function() {
    return new Swagger({
      spec: require('../swagger.json'),
      usePromise: true
    })
    .then(function(client) {
      client.clientAuthorizations.add("api_key", new Swagger.ApiKeyAuthorization("x-api-key", process.env.API_KEY, "header"));
      return client;
    });
  }
};
