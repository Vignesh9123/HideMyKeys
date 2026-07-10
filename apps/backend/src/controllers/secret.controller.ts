import { prisma } from "db";
import type { Response } from "express";
import type { AuthRequest } from "../auth";

export const getEnvironmentSecrets = async (req: AuthRequest, res: Response) => {
  try {
    const secrets = await prisma.secret.findMany({
      where: { environmentId: req.params.environmentId as string },
    });
    res.json(secrets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch secrets" });
  }
};

export const createEnvironmentSecret = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      res.status(400).json({ error: "Key and value are required" });
      return;
    }

    const secret = await prisma.secret.create({
      data: {
        key,
        value,
        environmentId: req.params.environmentId as string,
      },
    });
    res.json(secret);
  } catch (error) {
    res.status(500).json({ error: "Failed to create secret" });
  }
};

export const deleteSecret = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.secret.delete({
      where: { id: req.params.id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete secret" });
  }
};
