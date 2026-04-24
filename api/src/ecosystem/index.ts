import { Router, Request, Response } from 'express';
import { ecosystemQueries } from '../db/queries';

const router = Router();

router.get('/api/ecosystem', async (req: Request, res: Response) => {
  try {
    const graph = await ecosystemQueries.getFullGraph();
    res.status(200).json({ data: graph });
  } catch (error) {
    console.error('Failed to fetch ecosystem:', error);
    res.status(500).json({ error: 'Failed to fetch ecosystem graph' });
  }
});

export default router;
