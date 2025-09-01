import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import chatRoutes from './routes/chat.routes';
import forumRoutes from './routes/forum.routes';

dotenv.config();

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/forum', forumRoutes);

export default app;
