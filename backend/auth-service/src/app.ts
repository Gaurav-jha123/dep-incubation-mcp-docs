import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();


app.use(express.json());


app.use(cookieParser());

app.use(cors({
    origin : process.env.ALLOWED_ORIGNS,
    credentials : true,
}));

app.use('/auth', authRoutes);

app.get('/health' , (_req,res) => {
    res.status(200).json({message : 'Auth Service is live'})
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;