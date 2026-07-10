import { Router, type Express } from "express";
import {
  createProjectEnvironment,
  deleteEnvironment,
  getProjectEnvironments,
} from "../controllers/environment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const environmentRoutes = Router();

environmentRoutes.get("/project/:projectId", authenticate, getProjectEnvironments);
environmentRoutes.post("/project/:projectId", authenticate, createProjectEnvironment);
environmentRoutes.delete("/:id", authenticate, deleteEnvironment);

export default environmentRoutes;

