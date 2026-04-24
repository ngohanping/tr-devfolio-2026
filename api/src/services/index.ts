import { Router, Request, Response } from 'express';
import { serviceQueries } from '../db/queries';
import { CreateServicePayload, UpdateServicePayload } from '../models';

const router = Router();

router.get('/api/services', async (req: Request, res: Response) => {
  try {
    const services = await serviceQueries.getAll();
    res.status(200).json({ data: services });
  } catch (error) {
    console.error('GET /api/services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/api/services/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = await serviceQueries.getById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/api/services', async (req: Request, res: Response) => {
  try {
    const payload: CreateServicePayload = req.body;

    if (!payload.name || !payload.type) {
      return res.status(400).json({ error: 'Missing required fields: name, type' });
    }

    const newService = await serviceQueries.create(payload);
    res.status(201).json({ data: newService });
  } catch (error) {
    console.error('POST /api/services error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.patch('/api/services/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const payload: UpdateServicePayload = req.body;

    const updated = await serviceQueries.update(id, payload);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/api/services/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await serviceQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ data: { id, message: 'Service deleted' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
