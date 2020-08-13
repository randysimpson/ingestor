const MongoClient = require('mongodb').MongoClient;
const { Pool } = require('pg');
const config = require('../model/config');

//save the object to mongo
const saveMongo = (data) => {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the server
    MongoClient.connect(config.dburl, function (err, client) {
      if (err) {
        return reject(err);
      }
      const db = client.db(config.database);

      // Get the metrics collection
      const collection = db.collection('metrics');
      // Insert the data
      collection.insertMany(data, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
      client.close();
    });
  });
};

//save single metric to postgres
const savePg = (pool, metric) => {
  if(metric.tags) {
    const sql = 'INSERT INTO metrics (date, metric, value, tags, source) VALUES ($1, $2, $3, $4, $5);';
    const values = [metric.date, metric.metric, metric.value, metric.tags, metric.source];
    return pool.query(sql, values);
  } else {
    const sql = 'INSERT INTO metrics (date, metric, value, source) VALUES ($1, $2, $3, $4);';
    const values = [metric.date, metric.metric, metric.value, metric.source];
    return pool.query(sql, values);
  }
}

//save the object to postgres
const saveMetricsPg = (data) => {
  // setup the connection pool
  const pool = new Pool({
    user: config.dbuser,
    host: config.dbhost,
    database: config.dbname,
    password: config.dbpass,
    port: parseInt(config.dbport)
  });

  //run sequentially
  return data.reduce((p, item) => p.then(_ => savePg(pool, item)), Promise.resolve());
};

//save this data object into database.
const saveData = (data) => {
  if (config.dbtype === 'pg') {
    return saveMetricsPg(data);
  } else {
    return saveMongo(data);
  }
};

module.exports = saveData;
