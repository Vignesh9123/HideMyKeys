import { Router } from "express";
import { getCliSecrets } from "../controllers/cli.controller";

const router = Router();

router.get("/secrets", getCliSecrets);

export default router;
