import { prisma } from "db";
import type { Request, Response } from "express";

// For CLI - Note: Usually this uses a separate API key mechanism.
// For this prototype, we'll keep it unauthenticated or you would pass an environment token.
export const getCliSecrets = async (req: Request, res: Response) => {
  try {
    const environmentId = req.query.environmentId as string;
    if (!environmentId) {
      res.status(400).json({ error: "Environment ID is required" });
      return;
    }

    const secrets = await prisma.secret.findMany({
      where: { environmentId },
    });
    res.json(secrets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch secrets for CLI" });
  }
};
