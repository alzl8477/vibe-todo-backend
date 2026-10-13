import dotenv from "dotenv";
import dns from "node:dns";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import todoRouter from "./routers/todoRouter.js";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), ".env"),
  override: true,
});

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Todo Backend 서버가 실행 중입니다." });
});

app.use("/todos", todoRouter);

async function startServer() {
  console.log(`MONGODB_URI 환경변수 설정 여부: ${mongoUri ? "있음" : "없음"}`);

  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI 환경변수가 설정되지 않았습니다.");
    }

    await mongoose.connect(mongoUri);
    console.log("연결 성공");

    await new Promise((resolve, reject) => {
      const server = app.listen(port, resolve);
      server.once("error", reject);
    });

    console.log(`서버가 포트 ${port}번에서 실행 중입니다.`);
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exitCode = 1;
  }
}

await startServer();