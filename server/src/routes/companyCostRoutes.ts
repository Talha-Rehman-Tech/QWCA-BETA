import { Router } from 'express';
import {
  getCompanyCostConfig,
  saveCompanyCostConfig,
  resetCompanyCostConfig,
} from '../controllers/companyCostController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public read endpoint for cost estimator
router.get('/', getCompanyCostConfig);

// Protected Admin mutations
router.put('/', requireAdminAuth, saveCompanyCostConfig);
router.post('/', requireAdminAuth, saveCompanyCostConfig);
router.post('/reset', requireAdminAuth, resetCompanyCostConfig);

export default router;
