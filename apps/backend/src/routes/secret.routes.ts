import { Router, type Express } from "express";
import {
  createEnvironmentSecret,
  deleteSecret,
  getEnvironmentSecrets,
} from "../controllers/secret.controller";
import { authenticate } from "../middlewares/auth.middleware";

const secretRoutes = Router();

secretRoutes.get("/environment/:environmentId", authenticate, getEnvironmentSecrets);
secretRoutes.post("/environment/:environmentId", authenticate, createEnvironmentSecret);
secretRoutes.delete("/:secretId", authenticate, deleteSecret);

export default secretRoutes;