import express from "express";
import mongoose from "mongoose";
import Todo from "../models/todo.js";
import { isValidDate } from "../utils/date.js";

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
  const { date } = req.query;

  if (date !== undefined && !isValidDate(date)) {
    return res.status(400).json({
      message: "날짜는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.",
    });
  }

  try {
    const filter = date === undefined ? {} : { date };
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    console.error("할 일 목록 조회 실패:", error);
    return res.status(500).json({ message: "할 일 목록을 불러오지 못했습니다." });
  }
});

todoRouter.patch("/:id/completed", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body ?? {};

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "올바른 할 일 ID가 아닙니다." });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "완료 여부는 true 또는 false여야 합니다." });
  }

  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { returnDocument: "after", runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    }

    return res.status(200).json(todo);
  } catch (error) {
    console.error("할 일 완료 상태 변경 실패:", error);
    return res.status(500).json({ message: "할 일 완료 상태를 변경하지 못했습니다." });
  }
});

todoRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body ?? {};

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "올바른 할 일 ID가 아닙니다." });
  }

  if (title === undefined && date === undefined) {
    return res.status(400).json({ message: "수정할 제목 또는 날짜를 입력해 주세요." });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "할 일 제목을 입력해 주세요." });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ message: "할 일 제목은 200자 이하여야 합니다." });
    }
  }

  if (date !== undefined && !isValidDate(date)) {
    return res.status(400).json({
      message: "날짜는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.",
    });
  }

  try {
    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (date !== undefined) update.date = date;

    const todo = await Todo.findByIdAndUpdate(
      id,
      update,
      { returnDocument: "after", runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    }

    return res.status(200).json(todo);
  } catch (error) {
    console.error("할 일 수정 실패:", error);
    return res.status(500).json({ message: "할 일을 수정하지 못했습니다." });
  }
});

todoRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "올바른 할 일 ID가 아닙니다." });
  }

  try {
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "할 일을 삭제했습니다.", todo });
  } catch (error) {
    console.error("할 일 삭제 실패:", error);
    return res.status(500).json({ message: "할 일을 삭제하지 못했습니다." });
  }
});

todoRouter.post("/", async (req, res) => {
  const { title, date, completed = false } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ message: "할 일 제목을 입력해 주세요." });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "완료 여부는 true 또는 false여야 합니다." });
  }

  if (date !== undefined && !isValidDate(date)) {
    return res.status(400).json({
      message: "날짜는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.",
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ message: "할 일 제목은 200자 이하여야 합니다." });
  }

  try {
    const todo = await Todo.create({ title, date, completed });
    return res.status(201).json(todo);
  } catch (error) {
    console.error("할 일 저장 실패:", error);
    return res.status(500).json({ message: "할 일을 저장하지 못했습니다." });
  }
});

export default todoRouter;
