
const latestData = {
  data: [],
  addItem: (item) => {
    //replace the item in data with this item, if this item is newer.
    const existingItem = latestData.data.filter((metric) => {
      if(item.metric !== metric.metric || item.source !== metric.source) {
        return false;
      }
      //check tags
      if(item.tags) {
        return isEquivalent(item.tags, metric.tags);
      } else {
        return true;
      }
    });
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

//basic approach for comparing js objects
//http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
const isEquivalent = (a, b) => {
  if(!b) {
    return false;
  }
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
      return false;
  }

  for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
          return false;
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

module.exports = latestData;
