const express = require('express'),
  bodyParser = require('body-parser'),
  dataQueue = require('./model/dataQueue'),
  httpAPI = require('./controller/httpAPI');

const app = express();
const port = 3000;
const dataRoute = require('./routes/data');
const config = require('./model/config');
const { exec } = require('child_process');
dataRoute.queue = dataQueue;
dataQueue.run();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//define the API
app.use('/api/v1/data', dataRoute);
app.post('/api/v1/config', (req, res) => {
  const postData = req.body;
  if (postData.queuePopCount) {
    //modify config.
    dataQueue.config.queuePopCount = postData.queuePopCount;
  }
  if (postData.queueDuration) {
    //modify config.
    dataQueue.config.queueDuration = postData.queueDuration;
  }
  if (postData.dbRetry) {
    dataQueue.config.dbRetry = postData.dbRetry;
  }
  res.json("success");
});

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

//check to see if startNotifyHost is set.
if (config.startNotifyHost && config.startNotifyPort && config.startNotifyPath) {
  if (!config.ip) {
    //query to find the ip #hostname -I
    exec('hostname -I', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      //send the ip, date, podName, and version.
      const headers = {
        "Content-Type": "application/json"
      };
      const data = {
        ip: stdout,
        date: new Date(),
        podName: config.podName,
        version: config.version
      };
      httpAPI.httpPost(config.startNotifyHost, config.startNotifyPort, config.startNotifyPath, headers, data).then(() => {
        console.log("Posted initial start message");
      }, (err) => console.error({
        date: new Date(),
        message: "Error posting initial start message",
        data,
        err
      }));
    });
  }
}
