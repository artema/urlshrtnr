var api = require('../model/api'),
    logger = require('../model/logger');

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('main', { viewpost: { url: '', hash: '' } });
  });

  app.post('/', function (req, res) {
    var viewpost = {
      url: req.body.url,
      hash: req.body.hash
    };

    api.getClient().then(function(client) {console.log(req.body)
      client.default.post_url({ body: {
        hash: req.body.hash && req.body.hash.length > 0 ? req.body.hash : undefined,
        url: req.body.url
      } })
      .then(function(resp) {
        if (resp.obj.status !== 'ok') {
          logger.warn({ response: resp }, 'Error response from API.');

          var error = 'Internal server error';

          if (resp.obj.body.param === 'hash') {
            switch (resp.obj.body.reason) {
              case 'invalid':
                error = 'Invalid short URL';
                break;
              case 'exists':
                error = 'Short URL is already taken';
                break;
            }
          }
          else if (resp.obj.body.param === 'url') {
            error = 'Invalid URL';
          }

          return res.render('main', { error : error, viewpost: viewpost });
        }

        logger.debug({ hash: resp.obj.body }, 'Short URL created.');

        res.render('main', { result: resp.obj.body, viewpost: viewpost });
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
