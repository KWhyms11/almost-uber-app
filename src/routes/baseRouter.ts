import express from 'express';

const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.send('Hello! Welcome to the Rideshare App!');
})

export default router;
