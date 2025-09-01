import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { supabaseAuthMiddleware } from '../middleware/supabase-auth.middleware';

const router = Router();

router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/me', supabaseAuthMiddleware, authController.me);
router.post('/logout', supabaseAuthMiddleware, authController.logout);

export default router;
