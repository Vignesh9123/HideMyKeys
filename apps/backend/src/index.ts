import express from "express";
import cors from "cors";
import { prisma } from "db";
import bcrypt from "bcryptjs";
import { authenticate, type AuthRequest, generateToken } from "./auth";
import { config } from "dotenv";
config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Auth ---
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// --- Projects ---
app.get("/projects", authenticate, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/projects", authenticate, async (req: AuthRequest, res) => {
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
});

app.delete("/projects/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    // Basic authorization check: verify the project belongs to the user
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project || project.userId !== req.userId) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// --- Environments ---
app.get("/projects/:projectId/environments", authenticate, async (req: AuthRequest, res) => {
  try {
    const environments = await prisma.environment.findMany({
      where: { projectId: req.params.projectId },
    });
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch environments" });
  }
});

app.post("/projects/:projectId/environments", authenticate, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const environment = await prisma.environment.create({
      data: {
        name,
        projectId: req.params.projectId,
      },
    });
    res.json(environment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create environment" });
  }
});

app.delete("/environments/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.environment.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete environment" });
  }
});

// --- Secrets ---
app.get("/environments/:environmentId/secrets", authenticate, async (req: AuthRequest, res) => {
  try {
    const secrets = await prisma.secret.findMany({
      where: { environmentId: req.params.environmentId },
    });
    res.json(secrets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch secrets" });
  }
});

app.post("/environments/:environmentId/secrets", authenticate, async (req: AuthRequest, res) => {
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
        environmentId: req.params.environmentId,
      },
    });
    res.json(secret);
  } catch (error) {
    res.status(500).json({ error: "Failed to create secret" });
  }
});

app.delete("/secrets/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.secret.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete secret" });
  }
});

// For CLI - Note: Usually this uses a separate API key mechanism. 
// For this prototype, we'll keep it unauthenticated or you would pass an environment token.
app.get("/cli/secrets", async (req, res) => {
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});