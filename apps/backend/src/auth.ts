import type { Request } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-hide-my-keys";

export interface AuthRequest extends Request {
  userId?: string;
}


export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};
