export interface IAnswer {
  answer: string;
  isCorrect: boolean;
}

export interface IQuestion {
  question: string;
  answers: IAnswer[];
}

export interface IQuiz {
  title: string;
  description: string;
  user_id: string;
  questions: IQuestion[];
}

export interface IQuestion2 {
  question: string;
  answers: IAnswer[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAnswer2 {
  answer: string;
  isCorrect: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
