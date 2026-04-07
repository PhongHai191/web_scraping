require("dotenv").config();

const crawlQueue = require("../queue/queue");

async function scheduleJobs() {
  for (let i = 1; i <= 5; i++) {
    await crawlQueue.add(
      { page: i },
      { attempts: 3, backoff: 5000 }
    );
  }
}

async function start() {
  while (true) {
    console.log("Scheduling jobs...");
    await scheduleJobs();

    await new Promise((r) => setTimeout(r, 60000));
  }
}

start();