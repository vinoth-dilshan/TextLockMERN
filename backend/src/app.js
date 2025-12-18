import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import shareRoutes from "./routes/share.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "200kb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api", shareRoutes);

export default app;
