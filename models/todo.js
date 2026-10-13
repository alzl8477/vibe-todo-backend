import mongoose from "mongoose";
import { getCurrentDate, isValidDate } from "../utils/date.js";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "할 일 제목은 필수입니다."],
      trim: true,
      maxlength: [200, "할 일 제목은 200자 이하여야 합니다."],
    },
    date: {
      type: String,
      required: [true, "할 일 날짜는 필수입니다."],
      default: getCurrentDate,
      validate: {
        validator: isValidDate,
        message: "날짜는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.",
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "todos",
  },
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
