/* eslint-disable consistent-return */
import { RequestHandler } from 'express';
import {
  createAnswerCONTROLLER,
  createQuestionCONTROLLER,
  createQuizCONTROLLER,
  getAllQuizCONTROLLER,
  getQuizCONTROLLER,
} from '../controllers/quizController';
import { answerQuestionsCONTROLLER, getSolutionsCONTROLLER } from '../controllers/solutionController';
import { createUserCONTROLLER, userSignInCONTROLLER } from '../controllers/userController';
import logger from '../utils/logger';

/**
 * A Function that accepts the request from the http protocol to get all the quiz created
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[getAllQuizCONTROLLER]] for getting all existing Quiz
 */
export const getAllQuiz: RequestHandler = async (req, res) => {
  try {
    const response = await getAllQuizCONTROLLER({
      user_id: req.userId,
    });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to get a quiz
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[getQuizCONTROLLER]] for getting an existing Quiz
 */
export const getQuiz: RequestHandler = async (req, res) => {
  try {
    const response = await getQuizCONTROLLER({
      ...(req.query as { question_id?: string; quiz_id: string }),
      user_id: req.userId,
    });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to get a solution to a quiz
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[getSolutionsCONTROLLER]] for getting a solution to a Quiz
 */
export const getSolutions: RequestHandler = async (req, res) => {
  try {
    const response = await getSolutionsCONTROLLER({
      ...(req.query as { question_id?: string; quiz_id: string; solution_type?: 'success' | 'failed' }),
      user_id: req.userId,
    });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to solve a question
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[answerQuestionsCONTROLLER]] for solving a question within a Quiz
 */
export const answerQuestions: RequestHandler = async (req, res) => {
  try {
    const response = await answerQuestionsCONTROLLER({ ...req.body, user_id: req.userId });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to add answers
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[createAnswerCONTROLLER]] for creating adding an answer to a question within a Quiz
 */
export const answerCreation: RequestHandler = async (req, res) => {
  try {
    const response = await createAnswerCONTROLLER({ ...req.body, user_id: req.userId });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to add questions
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[createQuestionCONTROLLER]] for adding a question to a Quiz
 */
export const questionCreation: RequestHandler = async (req, res) => {
  try {
    const response = await createQuestionCONTROLLER({ ...req.body, user_id: req.userId });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to create a quiz
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[createQuizCONTROLLER]] for creating a quiz by a user
 */
export const quizCreation: RequestHandler = async (req, res) => {
  try {
    const response = await createQuizCONTROLLER({ ...req.body, user_id: req.userId });
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to create a user
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[createUserCONTROLLER]] for creating a user
 */
export const userCreation: RequestHandler = async (req, res) => {
  try {
    const response = await createUserCONTROLLER(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};

/**
 * A Function that accepts the request from the http protocol to log a user in
 * @param req this carries the request
 * @param res this returns the response
 * @returns a json http status response which can be 200, 400, or 500
 * @usedFunctions [[userSignInCONTROLLER]] for loggin a user in
 */
export const userSignIn: RequestHandler = async (req, res) => {
  try {
    const response = await userSignInCONTROLLER(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);
    const responseCode = error.success ? 400 : 500;
    return res.status(responseCode).json({ success: false, error: error.message || 'Could not fetch Data' });
  }
};
