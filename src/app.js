import express from 'express';
import routes from './routes/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(errorHandler);


app.use('/', routes);

export default app; 
