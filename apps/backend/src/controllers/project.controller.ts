import { prisma } from "db";
import type { Response } from "express";
import type { AuthRequest } from "../auth";

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId: req.userId!,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    // Basic authorization check: verify the project belongs to the user
    const project = await prisma.project.findUnique({ where: { id: req.params.id as string } });
    if (!project || project.userId !== req.userId) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    await prisma.project.delete({
      where: { id: req.params.id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
