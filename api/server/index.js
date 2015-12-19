import express from 'express';
import service from '../src';

const app = express();

function context(req, res) {
  return {
    done: (error, result) => {
      if (error) {
        return res.send(error.stack || error);
      }

      res.send(result);
    },
    succeed: result => {
      res.send(result);
    },
    fail: error => {
      res.send(error.stack || error);
    },
  };
}

app.get('/favicon.ico', (req, res) => {
  res.status(200).end();
});

app.get('/:handler', (req, res) => {
  service.handler(require(`./${req.params.handler}.json`), context(req, res));
});

const server = app.listen(process.env.PORT || 3100, () => {
  const {address, port} = server.address();

  console.log(`listening at http://${address}:${port}`)
});
