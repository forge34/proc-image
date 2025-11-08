import { Worker } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "image-processing",
  async (job) => {
    console.log(`job ${job.id} processed`);
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  worker.on("failed", (job, err) => {
    if (!job) {
      console.error("A job failed, but job data is unavailable:", err);
      return;
    }
    console.log(`${job.id} has failed with ${err.message}`);
  });
});
