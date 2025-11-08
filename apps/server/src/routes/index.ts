import { Router } from "express";
import { Jobs } from "../controllers/jobs";

const router: Router = Router();

router.get("/", (_, res) => {
  res.json("Hello word");
});

router.post("/upload", Jobs.upload);

export default router;
