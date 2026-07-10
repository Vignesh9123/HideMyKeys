import { Router } from "express";
import {
  createProjectEnvironment,
  deleteEnvironment,
  getProjectEnvironments,
} from "../controllers/environment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/projects/:projectId/environments", authenticate, getProjectEnvironments);
router.post("/projects/:projectId/environments", authenticate, createProjectEnvironment);
router.delete("/environments/:id", authenticate, deleteEnvironment);

export default router;
