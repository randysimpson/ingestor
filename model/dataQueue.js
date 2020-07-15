const config = require('./config');
const saveData = require('../controller/saveData');
const latestData = require('./latestData');

const dataQueue = {
  list: [],
  dataCache: latestData,
  config: config,
  addItem: (item) => {
    dataQueue.list.push(item);
    dataQueue.dataCache.addItem(item);
  },
  getItems: (number) => {
    let rtnList = [];
    const length = dataQueue.list.length;
    if(length > 0) {
      if(number >= length) {
        rtnList = [...dataQueue.list];
      } else {
        rtnList = [...dataQueue.list.slice(0, number)];
      }
      dataQueue.list = [...dataQueue.list.slice(number + 1)];
    }
    return rtnList;
  },
  run: () => {
    //add a metric to mark the launch of run.
    dataQueue.addItem({
      tags: {podName: dataQueue.config.podName},
      source: dataQueue.config.source,
      metric: "app.start",
      value: dataQueue.config.version,
      date: new Date()
    });
    //launch the inerval to dequeue.
    setInterval(() => {
      const date = new Date();
      const items = dataQueue.getItems(dataQueue.config.queuePopCount);
      items.push({
        tags: {podName: dataQueue.config.podName},
        source: dataQueue.config.source,
        metric: "queue.size",
        value: dataQueue.list.length,
        date: date
      });
      items.push({
        tags: {podName: dataQueue.config.podName},
        source: dataQueue.config.source,
        metric: "queue.save",
        value: items.length,
        date: date
      });
      saveData(items)
        .then((result) => {
          //success
          console.log("success items: " + items.length);
        }, (err) => {
          //error
          console.error(err);
        })
    }, dataQueue.config.queueDuration)
  }
};

module.exports = dataQueue;
