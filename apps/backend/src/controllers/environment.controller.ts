import { prisma } from "db";
import type { Response } from "express";
import type { AuthRequest } from "../auth";

export const getProjectEnvironments = async (req: AuthRequest, res: Response) => {
  try {
    const environments = await prisma.environment.findMany({
      where: { projectId: req.params.projectId as string },
    });
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch environments" });
  }
};

export const createProjectEnvironment = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const environment = await prisma.environment.create({
      data: {
        name,
        projectId: req.params.projectId as string,
      },
    });
    res.json(environment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create environment" });
  }
};

export const deleteEnvironment = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.environment.delete({
      where: { id: req.params.id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete environment" });
  }
};
