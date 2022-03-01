import { IAnswer, IQuestion } from '../database/interfaces/quiz';

export interface createQuizDTO {
  title: string;
  description?: string;
  user_id: string;
  questions: IQuestion[];
}

export interface createQuestionDTO {
  user_id: string;
  quiz_id: string;
  question: string;
  answers: IAnswer[];
}

export interface createAnswerDTO {
  user_id: string;
  question_id: string;
  answer: string;
  isCorrect: boolean;
}

export interface getQuizDTO {
  user_id: string;
  question_id?: string;
  quiz_id: string;
}

export interface getAllQuizDTO {
  user_id: string;
}
