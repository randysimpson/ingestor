const MongoClient = require('mongodb').MongoClient;
const config = require('../model/config');

//save this data object into database.
const saveData = (data) => {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the server
    MongoClient.connect(config.dburl, function(err, client) {
      if(err) {
        reject(err);
      }
      const db = client.db(config.database);

      // Get the metrics collection
      const collection = db.collection('metrics');
      // Insert the data
      collection.insertMany(data, function(err, result) {
        if(err) {
          reject(err);
        }
        resolve(result);
      });
      client.close();
    });
  })
};

module.exports = saveData;
