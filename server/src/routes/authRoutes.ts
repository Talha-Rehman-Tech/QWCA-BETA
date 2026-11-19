import { Router } from 'express';
import { loginAdmin, verifyAdmin, changePassword } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public login route
router.post('/login', loginAdmin);

// Protected routes (require Bearer JWT token)
router.get('/verify', requireAdminAuth, verifyAdmin);
router.put('/change-password', requireAdminAuth, changePassword);

export default router;
