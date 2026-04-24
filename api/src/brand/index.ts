import { Router } from 'express';

const router = Router();

router.get('/api/brand', (req, res) => {
  res.status(200).json({ data: 'Scoot PTE LTD' });
});

export default router;
