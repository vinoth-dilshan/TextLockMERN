import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import shareRoutes from "./routes/share.routes.js";
import { noCache } from "./middlewares/noCache.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "200kb" }));
app.use(morgan("dev"));
app.use(noCache);

app.get("/", (req, res) => {
  res.json({ ok: true, name: "TextLock API" });
});
app.use("/api", shareRoutes);
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

export default app;
