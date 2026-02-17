import express from 'express';
import dotenv from 'dotenv';
import { prisma } from './prisma';
import {authRouter} from './routes/user';
import {homePageRouter} from './routes/homePage';
import { businessRouter } from './routes/business';
import { serviceRouter } from './routes/service';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({origin: 'http://localhost:5173'}));
app.use ( "/auth",authRouter);
app.use( "/api", homePageRouter);
app.use("/api", businessRouter);
app.use("/api", serviceRouter);
app
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});