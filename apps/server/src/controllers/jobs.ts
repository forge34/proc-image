import { type RequestHandler, type Request } from "express";
import multer from "multer";
import { queue } from "../config/queue";
import { JobType } from "@proc-image/prisma";
import { parseImage } from "@proc-image/validators";

interface JobRequest extends Request {
  body: {
    action: JobType;
    width: string;
    height: string;
  };
}
const upload = multer({});

export const Jobs: Record<string, RequestHandler | RequestHandler[]> = {
  upload: [
    upload.single("image"),
    async (req: JobRequest, res) => {
      const file = req.file;

      if (!file) {
        res.status(404).json({ message: "no image uploaded" });
        return;
      }

      const data = parseImage({ image: file, ...req.body });
      const buffer = Buffer.from(file?.buffer).toString("base64");
      await queue.add(data.action, data);

      res.status(200).json({ messsage: "image processing started" });
    },
  ],
};
