import {type AuthRequest, JWT_SECRET } from "../auth";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};


