// import mongoose from "mongoose";
import { Schema, model, Types } from 'mongoose';
import { IAnswer, IQuestion, IQuiz } from '../interfaces/quiz';
import { IUser } from '../interfaces/user';

const AnswerSchema = new Schema<IAnswer>(
  {
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    answers: [AnswerSchema],
  },
  {
    timestamps: true,
  },
);

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: String, required: true },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  },
);

export const QuizModel = model<IQuiz>('Quiz', QuizSchema);
