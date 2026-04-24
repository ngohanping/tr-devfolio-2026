import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeNeo4j, closeNeo4j } from './db/neo4j';
import brandRouter from './brand';
import servicesRouter from './services';
import teamsRouter from './teams';
import projectsRouter from './projects';
import relationshipsRouter from './relationships';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(brandRouter);
app.use(servicesRouter);
app.use(teamsRouter);
app.use(projectsRouter);
app.use(relationshipsRouter);

app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await initializeNeo4j();
      app.listen(port, () => {
        console.log(`API running on port ${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await closeNeo4j();
    process.exit(0);
  });
}

export default app;
