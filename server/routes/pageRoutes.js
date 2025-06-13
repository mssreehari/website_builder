import express from 'express';
import { createPage, getPage } from '../controllers/pageController.js';

const router = express.Router();
router.post('/', createPage);
router.get('/:id', getPage);

export default router;
