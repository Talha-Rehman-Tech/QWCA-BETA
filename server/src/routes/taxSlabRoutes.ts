import { Router } from 'express';
import {
  getAllTaxYears,
  getTaxSlabByYear,
  saveTaxSlabYear,
  deleteTaxSlabYear,
  resetTaxSlabs,
} from '../controllers/taxSlabController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public read endpoints for front-end calculators
router.get('/', getAllTaxYears);
router.get('/:year', getTaxSlabByYear);

// Protected Admin mutations
router.post('/reset', requireAdminAuth, resetTaxSlabs);
router.put('/:year', requireAdminAuth, saveTaxSlabYear);
router.post('/:year', requireAdminAuth, saveTaxSlabYear);
router.delete('/:year', requireAdminAuth, deleteTaxSlabYear);

export default router;
