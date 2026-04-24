import { Router, Request, Response } from 'express';
import { mockServices, generateId } from '../db/mockData';
import { Service, CreateServicePayload, UpdateServicePayload } from '../models';

const router = Router();

router.get('/api/services', (req: Request, res: Response) => {
  try {
    const services = Array.from(mockServices.values());
    res.status(200).json({ data: services });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/api/services/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = mockServices.get(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/api/services', (req: Request, res: Response) => {
  try {
    const payload: CreateServicePayload = req.body;

    if (!payload.name || !payload.type) {
      return res.status(400).json({ error: 'Missing required fields: name, type' });
    }

    const id = generateId();
    const newService: Service = {
      id,
      name: payload.name,
      type: payload.type,
      description: payload.description,
      status: payload.status || 'active',
      teamId: payload.teamId,
      tags: payload.tags,
      version: payload.version,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockServices.set(id, newService);
    res.status(201).json({ data: newService });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.patch('/api/services/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = mockServices.get(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const payload: UpdateServicePayload = req.body;
    const updated: Service = {
      ...service,
      ...payload,
      updatedAt: new Date(),
    };

    mockServices.set(id, updated);
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/api/services/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const service = mockServices.get(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    mockServices.delete(id);
    res.status(200).json({ data: { id, message: 'Service deleted' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
