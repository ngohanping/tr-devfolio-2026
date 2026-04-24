import { Router, Request, Response } from 'express';
import { teamQueries } from '../db/queries';
import { CreateTeamPayload, UpdateTeamPayload } from '../models';

const router = Router();

router.get('/api/teams', async (req: Request, res: Response) => {
  try {
    const teams = await teamQueries.getAll();
    res.status(200).json({ data: teams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

router.get('/api/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const team = await teamQueries.getById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

router.post('/api/teams', async (req: Request, res: Response) => {
  try {
    const payload: CreateTeamPayload = req.body;

    if (!payload.name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const newTeam = await teamQueries.create(payload);
    res.status(201).json({ data: newTeam });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

router.patch('/api/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const payload: UpdateTeamPayload = req.body;

    const updated = await teamQueries.update(id, payload);
    if (!updated) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

router.delete('/api/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await teamQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({ data: { id, message: 'Team deleted' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
