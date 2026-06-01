import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { gamesRouter } from "./routes/games";
import { healthRouter } from "./routes/health";
import { scoresRouter } from "./routes/scores";
import { userRouter } from "./routes/user";

export const app = express();

app.use(helmet());
const allowedOrigins = config.corsOrigin.split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some(
        (allowed) =>
          allowed.trim() === origin ||
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:")
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Arcade Games API" });
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/games", gamesRouter);
app.use("/", scoresRouter);
app.use("/", userRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(500).json({ message: "Unexpected server error" });
});
