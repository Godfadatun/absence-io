export interface answerQuestionsDTO {
  user_id: string;
  question_id: string;
  answer_id: string;
}

export interface getSolutionsDTO {
  user_id: string;
  question_id?: string;
  quiz_id: string;
  solution_type?: 'success' | 'failed';
}
