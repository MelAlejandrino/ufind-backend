import express from 'express';
import { getUserHandler, addUserHandler, updateUserHandler, getUserByIdHandler } from '../controllers/userController.js';

const router = express.Router();

router.post('/user', getUserHandler);
router.post('/register', addUserHandler);
router.put('/user/edit', updateUserHandler);
router.get('/user/:studentId', getUserByIdHandler);


export default router;
