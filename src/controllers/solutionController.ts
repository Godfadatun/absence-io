/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import { HydratedDocument } from 'mongoose';
import { answerQuestionsSchema, getSolutionsSchema } from '../authSchema/solutionsSchema';
import { IAnswer2, IQuestion2 } from '../database/interfaces/quiz';
import { ISolution } from '../database/interfaces/solution';
import { QuizModel } from '../database/models/quiz';
import { SolutionModel } from '../database/models/solution';
import { UserModel } from '../database/models/user';
import { answerQuestionsDTO, getSolutionsDTO } from '../dto/solutionDTO';
import { sendObjectResponse, BadRequestException } from '../utils/errors';
import { theResponse } from '../utils/interface';

/**
 * A Function that records your solution to a question and scores your answer at the same time
 * @first_sub_condition On hitting this function if you have already attempted to answer a specified question using ``question_id``  it'll record your new answer and count your attempt
 * @second_sub_condition On hitting this function if you have not attempted to answer a specified question using ``question_id`` it'll record and push your answer as the first attempt to that question
 * @param data this is an object of the [[answerQuestionsDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[answerQuestionsSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[QuizModel]] for the quiz model, [[SolutionModel]] for the solution model
 * @TypeCheck [[IQuestion2]], [[IAnswer2]] for type checking the temporal question and answer schema respectively
 */
export const answerQuestionsCONTROLLER = async (data: answerQuestionsDTO): Promise<theResponse> => {
  const validation = answerQuestionsSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { answer_id, question_id, user_id } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const quiz = await QuizModel.findOne({ 'questions._id': { $in: question_id } }, 'questions user_id').exec();
    if (!quiz) throw Error(`quiz does not exists`);
    if (user._id.toString() === quiz.user_id) throw Error(`Sorry you can not answer your own questions`);

    const indexOfQuestion = (quiz.questions as IQuestion2[]).findIndex((question) => question._id.toString() === question_id);
    if (indexOfQuestion === -1) throw Error(`question does not exists`);

    const selectedAnswer = (quiz.questions[indexOfQuestion].answers as IAnswer2[]).find((question) => question._id.toString() === answer_id);
    if (!selectedAnswer) throw Error(`Answer does not exists`);

    const solution = await SolutionModel.findOne({ quiz_id: quiz._id.toString(), user_id: user._id }, 'attempted_questions').exec();
    if (solution) {
      const attemptedQuestions = solution.attempted_questions.find((question) => question.question_id === question_id);
      if (!attemptedQuestions) {
        solution.attempted_questions.push({
          question_id,
          success: selectedAnswer.isCorrect,
          no_of_attempts: 1,
        });
      }
      if (attemptedQuestions) {
        SolutionModel.updateOne(
          { 'attempted_questions.question_id': question_id },
          {
            $set: {
              'attempted_questions.$.success': selectedAnswer.isCorrect,
              'attempted_questions.$.no_of_attempts': attemptedQuestions.no_of_attempts++,
            },
          },
        ).exec();
      }
      await solution.save();
      return sendObjectResponse(`Question ${question_id} Answer Successfully`);
    }

    const newAttemptCreated: HydratedDocument<ISolution> = new SolutionModel({
      quiz_question_length: quiz.questions.length,
      quiz_id: quiz._id.toString(),
      user_id: user._id,
      attempted_questions: [
        {
          question_id,
          success: selectedAnswer.isCorrect,
          no_of_attempts: 1,
        },
      ],
    });
    await newAttemptCreated.save();

    return sendObjectResponse(`Question ${question_id} Answer Successfully`);
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz creation failed, kindly try again', e.data);
  }
};

/**
 * A Function that gets a users solution to a quiz and it can be filtered by ``question_id`` & ``solution_type``to get only one question
 * @param data this is an object of the [[getSolutionsDTO]] passed in
 * @returns an error response | a success message using [[theResponse]]
 * @responses [[BadRequestException]] for Negative Response && [[sendObjectResponse]] for Positive Response
 * @validation [[getSolutionsSchema]] is used to handle the request validation
 * @Models [[UserModel]] for the user model, [[SolutionModel]] for the solution model
 */
export const getSolutionsCONTROLLER = async (data: getSolutionsDTO): Promise<theResponse> => {
  const validation = getSolutionsSchema.validate(data);
  if (validation.error) return BadRequestException(validation.error.message);

  const { question_id, user_id, quiz_id, solution_type } = data;
  try {
    const user = await UserModel.findOne({ _id: user_id }).exec();
    if (!user) throw Error(`user does not exists`);

    const solution = await SolutionModel.findOne({ quiz_id, user_id: user._id }, 'attempted_questions quiz_question_length').exec();
    if (!solution) throw Error(`No Solution for this Quiz`);

    const succefulAttempts = solution.attempted_questions.filter((question) => question.success);
    const solutionData = {
      total_attempts: solution.attempted_questions.reduce((acc: any, curr: any) => {
        return acc + curr.no_of_attempts;
      }, 0),
      completion: `${solution.quiz_question_length - solution.attempted_questions.length} out of ${solution.quiz_question_length}`,
      scores: succefulAttempts ? succefulAttempts.length : 0,
    };

    if (question_id) {
      const attemptedQuestions = solution.attempted_questions.find((question) => question.question_id === question_id);
      if (!attemptedQuestions) throw Error(`No Solution for this Question`);

      return sendObjectResponse(`Solution retrieved successfully`, { ...(attemptedQuestions as { [key: string]: any })._doc, solutionData });
    }

    if (solution_type === 'success') {
      if (!succefulAttempts) return sendObjectResponse(`You failed all attempted questions`);
      return sendObjectResponse(`Solution retrieved successfully`, { ...succefulAttempts, solutionData });
    }

    if (solution_type === 'failed') {
      const attemptedQuestions = solution.attempted_questions.filter((question) => !question.success);

      if (!attemptedQuestions) return sendObjectResponse(`You passed all attempted questions`);
      return sendObjectResponse(`Solution retrieved successfully`, { ...attemptedQuestions, solutionData });
    }

    return sendObjectResponse(`Solution retrieved successfully`, { ...solution.attempted_questions, solutionData });
  } catch (e: any) {
    return BadRequestException(e.message || 'Quiz creation failed, kindly try again', e.data);
  }
};
