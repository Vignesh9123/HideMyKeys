import { Router } from "express";
import { createProject, deleteProject, getProjects } from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getProjects);
router.post("/", authenticate, createProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
