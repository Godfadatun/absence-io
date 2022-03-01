// import mongoose from "mongoose";
import { Schema, model, Types } from 'mongoose';
import { IAnswer, IQuestion, IQuiz } from '../interfaces/quiz';
import { IAttempt, ISolution } from '../interfaces/solution';
import { IUser } from '../interfaces/user';

const AttemptSchema = new Schema<IAttempt>(
  {
    question_id: { type: String, required: true },
    success: { type: Boolean, required: true, default: false },
    no_of_attempts: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

const SolutionSchema = new Schema<ISolution>(
  {
    quiz_question_length: { type: Number, required: true },
    quiz_id: { type: String, required: true },
    user_id: { type: String, required: true },
    attempted_questions: [AttemptSchema],
  },
  {
    timestamps: true,
  },
);

export const SolutionModel = model<ISolution>('Solution', SolutionSchema);
