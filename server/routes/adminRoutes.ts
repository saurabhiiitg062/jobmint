import { Router } from 'express';
import { loginAdmin, registerAdmin, getDashboardStats } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Can be secured or left open for initial seeding
router.get('/stats', authenticateAdmin, getDashboardStats);

export default router;
