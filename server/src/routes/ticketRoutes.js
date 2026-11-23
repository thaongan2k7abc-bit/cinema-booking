import { Router } from "express";
const router = Router();

router.get("/ping", (req, res) => res.json({ feature: "tickets" }));

export default router;
