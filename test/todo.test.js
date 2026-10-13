import assert from "node:assert/strict";
import test from "node:test";
import Todo from "../models/todo.js";
import { isValidDate } from "../utils/date.js";

test("new todos default to incomplete", () => {
  const todo = new Todo({ title: "장보기" });

  assert.equal(todo.completed, false);
});

test("new todos default to today's UTC date", () => {
  const todo = new Todo({ title: "장보기" });

  assert.match(todo.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(isValidDate(todo.date), true);
});

test("date validation accepts real YYYY-MM-DD dates only", () => {
  assert.equal(isValidDate("2024-02-29"), true);
  assert.equal(isValidDate("2025-02-29"), false);
  assert.equal(isValidDate("2025-13-01"), false);
  assert.equal(isValidDate("2025/01/01"), false);
  assert.equal(isValidDate(undefined), false);
});

test("todo timestamps include createdAt", () => {
  assert.equal(Todo.schema.options.timestamps, true);
  assert.ok(Todo.schema.path("createdAt"));
});
