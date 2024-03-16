import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/MahasiswaRoute.js';
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

// app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Server Running... ${port}`));
