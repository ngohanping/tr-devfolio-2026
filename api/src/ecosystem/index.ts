import { Router, Request, Response } from 'express';
import { ecosystemQueries } from '../db/queries';

const router = Router();

router.get('/api/ecosystem', async (_req: Request, res: Response) => {
  try {
    const graph = await ecosystemQueries.getFullGraph();
    res.status(200).json({ data: graph });
  } catch (error) {
    console.error('GET /api/ecosystem error:', error);
    res.status(500).json({ error: 'Failed to fetch ecosystem graph' });
  }
});

export default router;
