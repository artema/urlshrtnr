var api = require('../model/api'),
    logger = require('../model/logger');

module.exports = function(app) {
  app.get('/:url', function (req, res) {
    api.getClient().then(function(client) {
      client.default.get_url_id({ id: req.params.url })
      .then(function(resp) {
        if (resp.obj.status !== 'ok') {
          logger.warn({ response: resp }, 'Error response from API.');

          if (resp.obj.body.reason === 'notfound') {
            return res.status(404).render('url', { error : 'URL not found' });
          }

          return res.status(500).render('url', { error : 'Internal server error' });
        }

        logger.debug({ url: resp.obj.body.url }, 'Redirecting to URL.');
        res.redirect(resp.obj.body.url);
      })
      .catch(function(e) {
        logger.warn({ error: e }, 'Unable to call API.');
        res.status(500).end();
      });
    })
    .catch(function(e) {
      logger.error({ error: e }, 'Unable to create API client.');
      res.status(500).end();
    });
  });
};
