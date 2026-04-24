import { Router, Request, Response } from 'express';
import { relationshipQueries } from '../db/queries';

const router = Router();

// Team-Project Relationships (OWNS)
router.post('/api/relationships/teams-projects', async (req: Request, res: Response) => {
  try {
    const { teamId, projectId } = req.body;

    if (!teamId || !projectId) {
      return res.status(400).json({ error: 'Missing required fields: teamId, projectId' });
    }

    await relationshipQueries.createTeamOwnsProject(teamId, projectId);
    res.status(201).json({ data: { teamId, projectId, type: 'OWNS' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team-project relationship' });
  }
});

// Project-Service Relationships (DEPLOYED_ON)
router.post('/api/relationships/projects-services', async (req: Request, res: Response) => {
  try {
    const { projectId, serviceId } = req.body;

    if (!projectId || !serviceId) {
      return res.status(400).json({ error: 'Missing required fields: projectId, serviceId' });
    }

    await relationshipQueries.createProjectDeployedOnService(projectId, serviceId);
    res.status(201).json({ data: { projectId, serviceId, type: 'DEPLOYED_ON' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project-service relationship' });
  }
});

// Service Relationships (CALLS)
router.post('/api/relationships/services/calls', async (req: Request, res: Response) => {
  try {
    const { sourceServiceId, targetServiceId } = req.body;

    if (!sourceServiceId || !targetServiceId) {
      return res.status(400).json({ error: 'Missing required fields: sourceServiceId, targetServiceId' });
    }

    await relationshipQueries.createServiceCalls(sourceServiceId, targetServiceId);
    res.status(201).json({ data: { sourceServiceId, targetServiceId, type: 'CALLS' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service calls relationship' });
  }
});

// Service Relationships (EXPOSED_BY)
router.post('/api/relationships/services/exposed-by', async (req: Request, res: Response) => {
  try {
    const { sourceServiceId, targetServiceId } = req.body;

    if (!sourceServiceId || !targetServiceId) {
      return res.status(400).json({ error: 'Missing required fields: sourceServiceId, targetServiceId' });
    }

    await relationshipQueries.createServiceExposedBy(sourceServiceId, targetServiceId);
    res.status(201).json({ data: { sourceServiceId, targetServiceId, type: 'EXPOSED_BY' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service exposed-by relationship' });
  }
});

export default router;
