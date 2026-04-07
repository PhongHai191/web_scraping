require("dotenv").config();
const Queue = require("bull");

const crawlQueue = new Queue("crawl-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

module.exports = crawlQueue;