import { prisma } from "db";
import type { Response } from "express";
import type { AuthRequest } from "../auth";
import { decrypt, encrypt } from "../utils/security.utils";
import { config } from "dotenv";

config()

const ROOT_KEY_STRING = process.env.ROOT_KEY;
const ROOT_KEY = Buffer.from(ROOT_KEY_STRING!, 'base64')

export const getEnvironmentSecrets = async (req: AuthRequest, res: Response) => {
  try {
    const secrets = await prisma.secret.findMany({
      where: { environmentId: req.params.environmentId as string },
    });
    const decryptedSecrets = secrets.map((secret)=>{
        const encryptedSecret = secret.value;
        const decryptedSecret = decrypt(encryptedSecret, ROOT_KEY)
        return {
            ...secret,
            value: decryptedSecret 
        }
    })
    res.json(decryptedSecrets);
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

    const encryptedSecret = encrypt(value, ROOT_KEY)

    const secret = await prisma.secret.create({
      data: {
        key,
        value: encryptedSecret,
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
