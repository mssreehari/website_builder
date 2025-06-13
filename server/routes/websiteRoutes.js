import express from 'express';
import {
  createWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  exportToHtml
} from '../controllers/websiteController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Website CRUD operations
router.post('/', createWebsite);
router.get('/', getWebsites);
router.get('/:id', getWebsite);
router.patch('/:id', updateWebsite);
router.delete('/:id', deleteWebsite);

// Export website to HTML
router.get('/:id/export', exportToHtml);

export default router; 