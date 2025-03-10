import express, { Request, Response } from 'express';
import baseRouter from './routes/baseRouter';
import rideRouter from './routes/rideRouter';

const app = express();
const port = 3000;

app.use(express.json());
app.use(baseRouter);
app.use(rideRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
