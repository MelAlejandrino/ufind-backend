import express from 'express';
import { getAdminHandler } from '../controllers/adminController.js';

const router = express.Router();

router.post('/admin', getAdminHandler);

export default router;
