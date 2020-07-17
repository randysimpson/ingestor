
const config = {
  queuePopCount: process.env.QUEUE_POP_COUNT ? parseInt(process.env.QUEUE_POP_COUNT) : 75,
  queueDuration: process.env.QUEUE_DURATION ? parseInt(process.env.QUEUE_DURATION) : 60000,
  source: "ingestor",
  version: process.env.npm_package_version,
  podName: process.env.POD_NAME || "unknown",
  dburl: process.env.DB_URL,
  database: process.env.DB_NAME || "ingestor",
  dbRetry: 3,
  ip: process.env.IP || false,
  startNotifyHost: process.env.START_NOTIFY_HOST || false,
  startNotifyPort: process.env.START_NOTIFY_PORT ? parseInt(process.env.START_NOTIFY_PORT) : false,
  startNotifyPath: process.env.START_NOTIFY_PATH || false
};

module.exports = config;
