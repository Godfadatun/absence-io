import joi from 'joi';

export const answerQuestionsSchema = joi.object().keys({
  user_id: joi.string().required(),
  question_id: joi.string().required(),
  answer_id: joi.string().required(),
});

export const getSolutionsSchema = joi.object().keys({
  user_id: joi.string().required(),
  question_id: joi.string().optional(),
  quiz_id: joi.string().required(),
  solution_type: joi.string().valid('success', 'failed').optional(),
});
