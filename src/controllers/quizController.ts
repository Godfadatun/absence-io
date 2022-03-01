/* eslint-disable no-underscore-dangle */
import { HydratedDocument } from 'mongoose';
import { UserModel } from '../database/models/user';
import { sendObjectResponse, BadRequestException } from '../utils/errors';
import { theResponse } from '../utils/interface';
import { createAnswerDTO, createQuestionDTO, createQuizDTO, getQuizDTO } from '../dto/quizDTO';
import { QuizModel } from '../database/models/quiz';
import { createAnswerSchema, createQuestionSchema, createQuizSchema, getQuizSchema } from '../authSchema/quizSchema';
import { IQuestion2, IQuiz } from '../database/interfaces/quiz';

/**
 * A Function that creates a quiz by a user
 * @param data this is an object of the [[createQuizDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[createQuizSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[QuizModel]] for the quiz model
 * @TypeCheck [[IQuiz]] for type checking the quiz model
 */
export const createQuizCONTROLLER = async (data: createQuizDTO): Promise<theResponse> => {
  const validation = createQuizSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { title, description, user_id, questions } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const newQuizCreated: HydratedDocument<IQuiz> = new QuizModel({ title, description, user_id: user._id, questions });
    await newQuizCreated.save();

    return sendObjectResponse('New Quiz Created');
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz creation failed, kindly try again', e.data);
  }
};

/**
 * A Function that adds a Question to an already existing Quiz by a user **NB:** only the Quiz Creator can do this.
 * @param data this is an object of the [[createQuestionDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[createQuestionSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[QuizModel]] for the quiz model
 */
export const createQuestionCONTROLLER = async (data: createQuestionDTO): Promise<theResponse> => {
  const validation = createQuestionSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { answers, quiz_id, user_id, question } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const quiz = await QuizModel.findOne({ _id: quiz_id, user_id: user._id }).exec();
    if (!quiz) throw Error(`quiz does not exists`);

    quiz.questions.push({ answers, question });
    await quiz.save();

    return sendObjectResponse('New Question Created');
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz creation failed, kindly try again', e.data);
  }
};

/**
 * A Function that adds an Answer to a Question of an already existing Quiz by a user  **NB:** only the Quiz Creator can do this.
 * @param data this is an object of the [[createAnswerDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[createAnswerSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[QuizModel]] for the quiz model
 * @TypeCheck [[IQuestion2]] for type checking the temporal question schema
 */
export const createAnswerCONTROLLER = async (data: createAnswerDTO): Promise<theResponse> => {
  const validation = createAnswerSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { isCorrect, answer, question_id, user_id } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const quiz = await QuizModel.findOne({ 'questions._id': { $in: question_id }, user_id: user._id }, 'questions').exec();
    if (!quiz) throw Error(`quiz does not exists`);

    const indexOfQuestion = (quiz.questions as IQuestion2[]).findIndex((question) => question._id.toString() === question_id);
    if (indexOfQuestion === -1) throw Error(`question does not exists`);
    if (quiz.questions[indexOfQuestion].answers.length > 4) throw Error(`only 5 answer per question`);

    quiz.questions[indexOfQuestion].answers.push({ isCorrect, answer });
    await quiz.save();

    return sendObjectResponse('New Answer Created', { isCorrect, answer });
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz creation failed, kindly try again', e.data);
  }
};

/**
 * A Function that gets a quiz and it can be filtered by ``question_id`` to get only one question
 * @param data this is an object of the [[getQuizDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[getQuizSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[QuizModel]] for the quiz model
 * @TypeCheck [[IQuestion2]] for type checking the temporal question schema
 */
export const getQuizCONTROLLER = async (data: getQuizDTO): Promise<theResponse> => {
  const validation = getQuizSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { quiz_id, question_id, user_id } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const quiz = await QuizModel.findOne({ _id: quiz_id }, 'questions title description user_id').exec();
    if (!quiz) throw Error(`quiz does not exists`);

    if (question_id) {
      // const { questions, ...theQuiz } = quiz;
      const { _id, title, user_id: owner_id, description, questions } = quiz as { [key: string]: any };
      const retrievedQuestion = (questions as IQuestion2[]).find((question) => question._id.toString() === question_id);
      if (!retrievedQuestion) throw Error(`Question does not exist for this quiz`);

      return sendObjectResponse(`Question retrieved successfully`, { _id, title, owner_id, description, questions: retrievedQuestion });
    }

    return sendObjectResponse(`Quiz retrieved successfully`, quiz);
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz retrieval failed, kindly try again', e.data);
  }
};
