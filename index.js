import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/router.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const _PORT = process.env.PORT || 4000;

const app = express();

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://moneyholder.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200,
  }

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

async function Start() {
    try {
        mongoose.connect(process.env.DB_URL);
        app.listen(_PORT, () => console.log(`We are on PORT:${_PORT}`));
    } catch (e) {
        console.log(e);
    }
}

Start();