import { Router } from "express";
import {
  createEnvironmentSecret,
  deleteSecret,
  getEnvironmentSecrets,
} from "../controllers/secret.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/environments/:environmentId/secrets", authenticate, getEnvironmentSecrets);
router.post("/environments/:environmentId/secrets", authenticate, createEnvironmentSecret);
router.delete("/secrets/:id", authenticate, deleteSecret);

export default router;
