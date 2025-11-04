import { Router } from "express";

const router: Router = Router();

router.get("/", (_, res) => {
  res.json("Hello word");
});

export default router;
