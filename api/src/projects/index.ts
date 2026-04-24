import { Router, Request, Response } from 'express';
import { projectQueries } from '../db/queries';
import { CreateProjectPayload, UpdateProjectPayload } from '../models';

const router = Router();

router.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await projectQueries.getAll();
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const project = await projectQueries.getById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ data: project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const payload: CreateProjectPayload = req.body;

    if (!payload.name || !payload.teamId) {
      return res.status(400).json({ error: 'Missing required fields: name, teamId' });
    }

    const newProject = await projectQueries.create(payload);
    res.status(201).json({ data: newProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.patch('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const payload: UpdateProjectPayload = req.body;

    const updated = await projectQueries.update(id, payload);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await projectQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ data: { id, message: 'Project deleted' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
