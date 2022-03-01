export interface IAttempt {
  success: boolean;
  question_id: string;
  no_of_attempts: number;
}

export interface ISolution {
  quiz_question_length: number;
  quiz_id: string;
  user_id: string;
  attempted_questions: IAttempt[];
}
