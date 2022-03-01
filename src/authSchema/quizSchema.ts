import joi from 'joi';

export const createQuizSchema = joi.object().keys({
  user_id: joi.string().required(),
  title: joi.string().required(),
  description: joi.string().optional(),
  questions: joi
    .array()
    .items({
      question: joi.string().required(),
      answers: joi
        .array()
        .items({
          answer: joi.string().required(),
          isCorrect: joi.boolean().required(),
        })
        .max(5)
        .min(2)
        .has({
          answer: joi.string().required(),
          isCorrect: joi.boolean().invalid(false).required(),
        })
        .required(),
    })
    .required(),
});

export const createQuestionSchema = joi.object().keys({
  user_id: joi.string().required(),
  quiz_id: joi.string().required(),
  question: joi.string().required(),
  answers: joi
    .array()
    .items({
      answer: joi.string().required(),
      isCorrect: joi.boolean().required(),
    })
    .max(5)
    .min(2)
    .has({
      answer: joi.string().required(),
      isCorrect: joi.boolean().invalid(false).required(),
    })
    .required(),
});

export const createAnswerSchema = joi.object().keys({
  user_id: joi.string().required(),
  question_id: joi.string().required(),
  answer: joi.string().required(),
  isCorrect: joi.boolean().required(),
});

export const getQuizSchema = joi.object().keys({
  user_id: joi.string().required(),
  question_id: joi.string().optional(),
  quiz_id: joi.string().required(),
});

export const getAllQuizSchema = joi.object().keys({
  user_id: joi.string().required(),
});
