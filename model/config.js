
const config = {
  queuePopCount: process.env.QUEUE_POP_COUNT ? parseInt(process.env.QUEUE_POP_COUNT) : 75,
  queueDuration: process.env.QUEUE_DURATION ? parseInt(process.env.QUEUE_DURATION) : 60000,
  source: "ingestor",
  version: process.env.npm_package_version,
  podName: process.env.POD_NAME || "unknown",
  dburl: process.env.DB_URL,
  database: process.env.DB_NAME || "ingestor"
};

module.exports = config;
