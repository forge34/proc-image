import { ImageJob } from "@proc-image/validators";
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

console.log("Worker starting");

const worker = new Worker<ImageJob>(
  "image-processing",
  async (job) => {
    console.log(`job ${job.id} processed`);
    const data = job.data;

    if (data.action == "RESIZE") {
    } else {
    }
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  if (!job) {
    console.error("A job failed, but job data is unavailable:", err);
    return;
  }
  console.log(`${job.id} has failed with ${err.message}`);
});
