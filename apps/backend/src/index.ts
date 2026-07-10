import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes";
import cliRoutes from "./routes/cli.routes";
import environmentRoutes from "./routes/environment.routes";
import projectRoutes from "./routes/project.routes";
import secretRoutes from "./routes/secret.routes";

config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", environmentRoutes);
app.use("/", secretRoutes);
app.use("/cli", cliRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
