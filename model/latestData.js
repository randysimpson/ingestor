
const latestData = {
  data: [],
  addItem: (item) => {
    //replace the item in data with this item, if this item is newer.
    const existingItem = latestData.data.filter((metric) => item.metric === metric.metric &&
      item.source === metric.source &&
      item.tags === metric.tags);
    if (existingItem.length > 0) {
      if (existingItem[0].date < item.date) {
        existingItem[0].date = item.date;
        existingItem[0].value = item.value;
      }
    } else {
      //add it.
      latestData.data.push(item);
    }
  },
  getItems: () => {
    //return an array of the data items.
    return latestData.data;
  }
}

module.exports = latestData;
