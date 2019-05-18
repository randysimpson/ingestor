const config = require('./config');
const saveData = require('../controller/saveData');

const dataQueue = {
  list: [],
  addItem: (item) => {
    dataQueue.list.push(item);
  },
  getItems: (number) => {
    let rtnList = [];
    const length = dataQueue.list.length;
    if(length > 0) {
      if(number <= length) {
        rtnList = [...dataQueue.list];
      } else {
        rtnList = [...dataQueue.list.slice(0, number)];
      }
      dataQueue.list = dataQueue.list.filter(i => !rtnList.includes(i));
    }
    return rtnList;
  },
  run: () => {
    //add a metric to mark the launch of run.
    dataQueue.addItem({
      tags: {podName: config.podName},
      source: config.source,
      metric: "app.start",
      value: config.version,
      date: new Date()
    });
    //launch the inerval to dequeue.
    setInterval(() => {
      const date = new Date();
      const items = dataQueue.getItems(config.queuePopLength);
      items.push({
        tags: {podName: config.podName},
        source: config.source,
        metric: "queue.save",
        value: dataQueue.list.length,
        date: date
      });
      items.push({
        tags: {podName: config.podName},
        source: config.source,
        metric: "queue.size",
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
    }, config.queueDuration)
  }
};

module.exports = dataQueue;
