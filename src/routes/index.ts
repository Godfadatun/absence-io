import express from 'express';
import { validateSession } from '../utils/jwt';
import { answerCreation, answerQuestions, getQuiz, getSolutions, questionCreation, quizCreation, userCreation, userSignIn } from './routes';

const router = express.Router();

router.get('/', (_, res) => res.json({ success: true, message: 'User gateway v1 up.' }));

router.post('/signup', userCreation);
router.post('/signin', userSignIn);

router.use(validateSession);
router.post('/create-quiz', quizCreation);
router.post('/create-questions', questionCreation);
router.post('/create-answers', answerCreation);
router.post('/answer-questions', answerQuestions);
router.get('/get-solutions', getSolutions);
router.get('/get-quiz', getQuiz);

export default router;
