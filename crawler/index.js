require("dotenv").config();

const { scheduleJobs } = require("../scheduler/scheduler");
require("../worker/worker");

async function start() {
  console.log("Starting crawler...");
  await scheduleJobs();
}

start();