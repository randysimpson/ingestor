
const config = {
  queuePopLength: 75,
  queueDuration: 1000*60,
  source: "ingestor",
  version: process.env.npm_package_version,
  podName: process.env.POD_NAME || "unknown",
  dburl: process.env.DB_URL,
  database: process.env.DB_NAME || "ingestor"
};

module.exports = config;
