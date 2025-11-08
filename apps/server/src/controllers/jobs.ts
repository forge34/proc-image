import { type RequestHandler, type Request } from "express";
import multer from "multer";
import { queue } from "../config/queue";
import { JobType } from "@proc-image/prisma";

interface JobRequest extends Request {
  body: {
    action: JobType;
  };
}
const upload = multer({});
const maxFileSize = 1024 * 1024 * 1024;

export const Jobs: Record<string, RequestHandler | RequestHandler[]> = {
  upload: [
    upload.single("image"),
    async (req: JobRequest, res) => {
      const file = req.file;
      const action = req.body.action as JobType;

      if (!file) {
        res.status(404).json({ message: "no image uploaded" });
        return;
      }

      if (file.buffer.byteLength === maxFileSize) {
        res.status(404).json({ message: "File is too big" });
        return;
      }
      const buffer = Buffer.from(file?.buffer).toString("base64");
      await queue.add(action.toString(), { image: buffer });

      res.status(200).json({ messsage: "image processing started" });
    },
  ],
};
