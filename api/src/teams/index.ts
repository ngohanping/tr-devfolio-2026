import { Router, Request, Response } from 'express';
import { mockTeams, generateId } from '../db/mockData';
import { Team, CreateTeamPayload, UpdateTeamPayload } from '../models';

const router = Router();

router.get('/api/teams', (req: Request, res: Response) => {
  try {
    const teams = Array.from(mockTeams.values());
    res.status(200).json({ data: teams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

router.get('/api/teams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const team = mockTeams.get(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json({ data: team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

router.post('/api/teams', (req: Request, res: Response) => {
  try {
    const payload: CreateTeamPayload = req.body;

    if (!payload.name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const id = generateId();
    const newTeam: Team = {
      id,
      name: payload.name,
      description: payload.description,
      lead: payload.lead,
      members: payload.members,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTeams.set(id, newTeam);
    res.status(201).json({ data: newTeam });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

router.patch('/api/teams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const team = mockTeams.get(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const payload: UpdateTeamPayload = req.body;
    const updated: Team = {
      ...team,
      ...payload,
      updatedAt: new Date(),
    };

    mockTeams.set(id, updated);
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

router.delete('/api/teams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const team = mockTeams.get(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    mockTeams.delete(id);
    res.status(200).json({ data: { id, message: 'Team deleted' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
