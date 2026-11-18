import { Router } from 'express';
import {
  getCompanyCostConfig,
  saveCompanyCostConfig,
  resetCompanyCostConfig,
} from '../controllers/companyCostController.js';

const router = Router();

router.get('/', getCompanyCostConfig);
router.put('/', saveCompanyCostConfig);
router.post('/', saveCompanyCostConfig);
router.post('/reset', resetCompanyCostConfig);

export default router;
