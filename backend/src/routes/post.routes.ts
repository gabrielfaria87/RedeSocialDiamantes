import { Router } from 'express';
import { createPost, getPosts, likePost, unlikePost, deletePost } from '../controllers/post.controller';
import { supabaseAuthMiddleware } from '../middleware/supabase-auth.middleware';

const router = Router();
router.post('/', supabaseAuthMiddleware, createPost);
router.get('/', supabaseAuthMiddleware, getPosts);
router.post('/:id/like', supabaseAuthMiddleware, likePost);
router.delete('/:id/like', supabaseAuthMiddleware, unlikePost);
router.delete('/:id', supabaseAuthMiddleware, deletePost);

export default router;
