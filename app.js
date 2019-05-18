const express = require('express'),
  bodyParser = require('body-parser'),
  dataQueue = require('./model/dataQueue');

const app = express();
const port = 3000;
const dataRoute = require('./routes/data');
dataRoute.queue = dataQueue;
dataQueue.run();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//define the API
app.use('/api/v1/data', dataRoute);

app.get('/', (req, res) => res.send('Hello World!'));

app.use(function (req, res) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
      const html = `
<!doctype html>
<html>

<head>
<title>ingestor - 404</title>
</head>

<body>
  <div class='container'>
      <h3>404 Error the page was not found.</h3>
  </div>
</body>
</html>`;
      res.send(html);
      return;
  }

  // respond with json
  if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
