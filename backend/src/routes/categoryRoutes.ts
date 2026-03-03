import { Router } from 'express';
import { getCategories, getCategoryBySlug } from '../controllers/categoryController';

const router = Router();

// GET /api/v1/categories
router.get('/', getCategories);

// GET /api/v1/categories/:slug
router.get('/:slug', getCategoryBySlug);

export default router;
