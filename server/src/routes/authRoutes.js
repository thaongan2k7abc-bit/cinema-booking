import { Router } from "express";
const router = Router();

router.get("/ping", (req, res) => res.json({ feature: "auth" }));

export default router;
