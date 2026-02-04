import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import connectToDb from './db/db.js';

app.use(cors());

connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello World');
});

// module.exports= app;
export default app;


