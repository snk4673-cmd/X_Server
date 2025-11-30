import express from "express";
import cors from "cors";
import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// dirname 처리 (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../Client")));

app.use("/post", postsRouter);
app.use("/auth", authRouter);

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(config.host.port, () => {
  console.log("Server running at", config.host.port);
});
