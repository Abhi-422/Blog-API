import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173/',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);
app.get('/', (res) => {
    res.send('Welcome to the Blog App API');
});
export { app };