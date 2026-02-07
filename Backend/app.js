import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello World');
});


app.use('/users', userRoutes);

// module.exports= app;
export default app;


