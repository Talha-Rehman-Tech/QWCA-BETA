import { Router } from 'express';
import {
  getAllTaxYears,
  getTaxSlabByYear,
  saveTaxSlabYear,
  deleteTaxSlabYear,
  resetTaxSlabs,
} from '../controllers/taxSlabController.js';

const router = Router();

router.get('/', getAllTaxYears);
router.post('/reset', resetTaxSlabs);
router.get('/:year', getTaxSlabByYear);
router.put('/:year', saveTaxSlabYear);
router.post('/:year', saveTaxSlabYear);
router.delete('/:year', deleteTaxSlabYear);

export default router;
