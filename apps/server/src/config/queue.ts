import { ImageJob } from "@proc-image/validators";
import { Queue } from "bullmq";

export const queue = new Queue<ImageJob>("image-processing");

