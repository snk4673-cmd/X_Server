import express from "express";
import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/post", postsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

connectDB()
  .then(() => {
    app.listen(config.host.port);
  })
  .catch(console.error);
