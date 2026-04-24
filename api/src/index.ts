import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import brandRouter from './brand';
import servicesRouter from './services';
import teamsRouter from './teams';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(brandRouter);
app.use(servicesRouter);
app.use(teamsRouter);

app.get('/health', (_, res) => {
  res.status(200).send('OK');
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log();
  });
}

export default app;
