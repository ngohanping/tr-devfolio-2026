import { getSession } from './neo4j';
import { serializeNeo4jResponse } from '../utils/serializer';
import { Team, Project, Service, ServiceWithRelations, ProjectWithRelations, TeamWithRelations } from '../models';

export const teamQueries = {
  getAll: async (): Promise<TeamWithRelations[]> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (team:Team)
        OPTIONAL MATCH (team)-[:OWNS]->(project:Project)
        RETURN team, collect(project) as projects
      `);

      return result.records.map(record => {
        const team = record.get('team').properties;
        const projects = record.get('projects')
          .map((p: any) => p?.properties || null)
          .filter((p: any) => p !== null);
        return serializeNeo4jResponse({ ...team, projects }) as TeamWithRelations;
      });
    } finally {
      await session.close();
    }
  },

  getById: async (id: string): Promise<TeamWithRelations | null> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (team:Team {id: $id})
        OPTIONAL MATCH (team)-[:OWNS]->(project:Project)
        RETURN team, collect(project) as projects
      `, { id });

      if (result.records.length === 0) return null;

      const record = result.records[0];
      const team = record.get('team').properties;
      const projects = record.get('projects')
        .map((p: any) => p?.properties || null)
        .filter((p: any) => p !== null);

      return serializeNeo4jResponse({ ...team, projects }) as TeamWithRelations;
    } finally {
      await session.close();
    }
  },

  create: async (payload: { name: string; description?: string; lead?: string; members?: string[] }): Promise<Team> => {
    const session = getSession();
    try {
      const result = await session.run(`
        CREATE (team:Team {
          id: randomUUID(),
          name: $name,
          description: $description,
          lead: $lead,
          members: $members,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN team
      `, {
        name: payload.name,
        description: payload.description || null,
        lead: payload.lead || null,
        members: payload.members || [],
      });

      return serializeNeo4jResponse(result.records[0].get('team').properties);
    } finally {
      await session.close();
    }
  },

  update: async (id: string, payload: Partial<Team>): Promise<Team | null> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (team:Team {id: $id})
        SET team += $updates, team.updatedAt = datetime()
        RETURN team
      `, { id, updates: { ...payload, updatedAt: undefined } });

      if (result.records.length === 0) return null;
      return serializeNeo4jResponse(result.records[0].get('team').properties);
    } finally {
      await session.close();
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (team:Team {id: $id})
        DETACH DELETE team
        RETURN count(team) as deleted
      `, { id });

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  },
};

export const projectQueries = {
  getAll: async (): Promise<ProjectWithRelations[]> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (project:Project)
        OPTIONAL MATCH (team:Team)-[:OWNS]->(project)
        RETURN project, team
      `);

      const projects = result.records.map(record => {
        const project = record.get('project').properties;
        const team = record.get('team')?.properties || null;
        // Ensure project has an ID - use name as fallback for existing projects
        return { ...project, id: project.id || project.name, team };
      });

      // Load all services once
      const serviceResult = await session.run(`
        MATCH (service:Service)
        OPTIONAL MATCH (service)-[:CALLS]->(called:Service)
        OPTIONAL MATCH (caller:Service)-[:CALLS]->(service)
        OPTIONAL MATCH (service)-[:EXPOSED_BY]->(exposed:Service)
        OPTIONAL MATCH (project:Project)-[:DEPLOYED_ON]->(service)
        WITH service, collect(DISTINCT called) as calls, collect(DISTINCT caller) as calledBy, collect(DISTINCT exposed) as exposedBy, collect(DISTINCT project) as projects
        RETURN service, calls, calledBy, exposedBy, projects[0] as project
      `);

      const services = serviceResult.records.map(rec => {
        const service = rec.get('service').properties;
        const serviceProject = rec.get('project')?.properties || null;
        const calls = rec.get('calls').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        const calledBy = rec.get('calledBy').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        const exposedBy = rec.get('exposedBy').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        return { ...service, project: serviceProject, calls, calledBy, exposedBy };
      });

      // Attach same services to all projects
      return projects.map(project =>
        serializeNeo4jResponse({ ...project, services }) as ProjectWithRelations
      );
    } finally {
      await session.close();
    }
  },

  getById: async (id: string): Promise<ProjectWithRelations | null> => {
    const session = getSession();
    try {
      // Try to find by ID first, then by name (for projects without IDs)
      let result = await session.run(`
        MATCH (project:Project {id: $id})
        OPTIONAL MATCH (team:Team)-[:OWNS]->(project)
        RETURN project, team
      `, { id });

      if (result.records.length === 0) {
        // Fallback: try matching by name
        result = await session.run(`
          MATCH (project:Project {name: $id})
          OPTIONAL MATCH (team:Team)-[:OWNS]->(project)
          RETURN project, team
        `, { id });
      }

      if (result.records.length === 0) return null;

      const record = result.records[0];
      const project = record.get('project').properties;
      const team = record.get('team')?.properties || null;

      // Load ALL services in the system (not just deployed to this project)
      const serviceResult = await session.run(`
        MATCH (service:Service)
        OPTIONAL MATCH (service)-[:CALLS]->(called:Service)
        OPTIONAL MATCH (caller:Service)-[:CALLS]->(service)
        OPTIONAL MATCH (service)-[:EXPOSED_BY]->(exposed:Service)
        OPTIONAL MATCH (project:Project)-[:DEPLOYED_ON]->(service)
        WITH service, collect(DISTINCT called) as calls, collect(DISTINCT caller) as calledBy, collect(DISTINCT exposed) as exposedBy, collect(DISTINCT project) as projects
        RETURN service, calls, calledBy, exposedBy, projects[0] as project
      `);

      const services = serviceResult.records.map(rec => {
        const service = rec.get('service').properties;
        const serviceProject = rec.get('project')?.properties || null;
        const calls = rec.get('calls').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        const calledBy = rec.get('calledBy').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        const exposedBy = rec.get('exposedBy').map((s: any) => s?.properties || null).filter((s: any) => s !== null);
        return { ...service, project: serviceProject, calls, calledBy, exposedBy };
      });

      // Ensure project has an ID
      const projectWithId = { ...project, id: project.id || project.name, team, services };
      return serializeNeo4jResponse(projectWithId) as ProjectWithRelations;
    } finally {
      await session.close();
    }
  },

  create: async (payload: { name: string; description?: string; teamId: string }): Promise<Project> => {
    const session = getSession();
    try {
      const result = await session.run(`
        CREATE (project:Project {
          id: randomUUID(),
          name: $name,
          description: $description,
          teamId: $teamId,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN project
      `, {
        name: payload.name,
        description: payload.description || null,
        teamId: payload.teamId,
      });

      return serializeNeo4jResponse(result.records[0].get('project').properties);
    } finally {
      await session.close();
    }
  },

  update: async (id: string, payload: Partial<Project>): Promise<Project | null> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (project:Project {id: $id})
        SET project += $updates, project.updatedAt = datetime()
        RETURN project
      `, { id, updates: { ...payload, updatedAt: undefined } });

      if (result.records.length === 0) return null;
      return serializeNeo4jResponse(result.records[0].get('project').properties);
    } finally {
      await session.close();
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (project:Project {id: $id})
        DETACH DELETE project
        RETURN count(project) as deleted
      `, { id });

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  },
};

function mapNodes(nodes: any[]): any[] {
  return nodes.map((s: any) => s?.properties || null).filter(Boolean);
}

export const serviceQueries = {
  getAll: async (): Promise<ServiceWithRelations[]> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (service:Service)
        OPTIONAL MATCH (project:Project)-[:DEPLOYED_ON]->(service)
        OPTIONAL MATCH (service)-[:CALLS]->(called:Service)
        OPTIONAL MATCH (caller:Service)-[:CALLS]->(service)
        OPTIONAL MATCH (service)-[:EXPOSED_BY]->(exp:Service)
        WITH service, project, collect(DISTINCT called) as calls, collect(DISTINCT caller) as calledBy, collect(DISTINCT exp) as exposedBy
        RETURN DISTINCT service, project, calls, calledBy, exposedBy
      `);

      return result.records.map(record => {
        const service = record.get('service').properties;
        const project = record.get('project')?.properties || null;
        const calls = mapNodes(record.get('calls'));
        const calledBy = mapNodes(record.get('calledBy'));
        const exposedBy = mapNodes(record.get('exposedBy'));
        return serializeNeo4jResponse({ ...service, project, calls, calledBy, exposedBy }) as ServiceWithRelations;
      });
    } finally {
      await session.close();
    }
  },

  getById: async (id: string): Promise<ServiceWithRelations | null> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (service:Service {id: $id})
        OPTIONAL MATCH (project:Project)-[:DEPLOYED_ON]->(service)
        WITH service, project
        OPTIONAL MATCH (service)-[:CALLS]->(called:Service)
        WITH service, project, collect(DISTINCT called) as calls
        OPTIONAL MATCH (caller:Service)-[:CALLS]->(service)
        WITH service, project, calls, collect(DISTINCT caller) as calledBy
        OPTIONAL MATCH (service)-[:EXPOSED_BY]->(exp:Service)
        RETURN service, project, calls, calledBy, collect(DISTINCT exp) as exposedBy
      `, { id });

      if (result.records.length === 0) return null;

      const record = result.records[0];
      const service = record.get('service').properties;
      const project = record.get('project')?.properties || null;
      const calls = mapNodes(record.get('calls'));
      const calledBy = mapNodes(record.get('calledBy'));
      const exposedBy = mapNodes(record.get('exposedBy'));

      return serializeNeo4jResponse({ ...service, project, calls, calledBy, exposedBy }) as ServiceWithRelations;
    } finally {
      await session.close();
    }
  },

  create: async (payload: any): Promise<Service> => {
    const session = getSession();
    try {
      const result = await session.run(`
        CREATE (service:Service {
          id: randomUUID(),
          name: $name,
          type: $type,
          description: $description,
          status: $status,
          teamId: $teamId,
          tags: $tags,
          version: $version,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN service
      `, {
        name: payload.name,
        type: payload.type,
        description: payload.description || null,
        status: payload.status || 'active',
        teamId: payload.teamId || null,
        tags: payload.tags || [],
        version: payload.version || null,
      });

      return serializeNeo4jResponse(result.records[0].get('service').properties);
    } finally {
      await session.close();
    }
  },

  update: async (id: string, payload: Partial<Service>): Promise<Service | null> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (service:Service {id: $id})
        SET service += $updates, service.updatedAt = datetime()
        RETURN service
      `, { id, updates: { ...payload, updatedAt: undefined } });

      if (result.records.length === 0) return null;
      return serializeNeo4jResponse(result.records[0].get('service').properties);
    } finally {
      await session.close();
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (service:Service {id: $id})
        DETACH DELETE service
        RETURN count(service) as deleted
      `, { id });

      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  },
};

export const relationshipQueries = {
  createTeamOwnsProject: async (teamId: string, projectId: string): Promise<boolean> => {
    const session = getSession();
    try {
      await session.run(`
        MATCH (team:Team {id: $teamId})
        MATCH (project:Project {id: $projectId})
        MERGE (team)-[:OWNS]->(project)
      `, { teamId, projectId });
      return true;
    } finally {
      await session.close();
    }
  },

  createProjectDeployedOnService: async (projectId: string, serviceId: string): Promise<boolean> => {
    const session = getSession();
    try {
      await session.run(`
        MATCH (project:Project {id: $projectId})
        MATCH (service:Service {id: $serviceId})
        MERGE (project)-[:DEPLOYED_ON]->(service)
      `, { projectId, serviceId });
      return true;
    } finally {
      await session.close();
    }
  },

  createServiceCalls: async (sourceId: string, targetId: string): Promise<boolean> => {
    const session = getSession();
    try {
      await session.run(`
        MATCH (source:Service {id: $sourceId})
        MATCH (target:Service {id: $targetId})
        MERGE (source)-[:CALLS]->(target)
      `, { sourceId, targetId });
      return true;
    } finally {
      await session.close();
    }
  },

  createServiceExposedBy: async (sourceId: string, targetId: string): Promise<boolean> => {
    const session = getSession();
    try {
      await session.run(`
        MATCH (source:Service {id: $sourceId})
        MATCH (target:Service {id: $targetId})
        MERGE (source)-[:EXPOSED_BY]->(target)
      `, { sourceId, targetId });
      return true;
    } finally {
      await session.close();
    }
  },
};

export const ecosystemQueries = {
  getFullGraph: async (): Promise<{ nodes: any[]; edges: any[] }> => {
    const session = getSession();
    try {
      const teamsResult = await session.run('MATCH (t:Team) RETURN t');
      const projectsResult = await session.run('MATCH (p:Project) RETURN p');
      const servicesResult = await session.run('MATCH (s:Service) RETURN s');
      const edgesResult = await session.run(`
        MATCH (a:Team)-[:OWNS]->(b:Project)
        RETURN COALESCE(a.id, a.name) AS sourceId, COALESCE(b.id, b.name) AS targetId, 'OWNS' AS type
        UNION ALL
        MATCH (a:Project)-[:DEPLOYED_ON]->(b:Service)
        RETURN COALESCE(a.id, a.name) AS sourceId, COALESCE(b.id, b.name) AS targetId, 'DEPLOYED_ON' AS type
        UNION ALL
        MATCH (a:Service)-[:CALLS]->(b:Service)
        RETURN COALESCE(a.id, a.name) AS sourceId, COALESCE(b.id, b.name) AS targetId, 'CALLS' AS type
        UNION ALL
        MATCH (a:Service)-[:EXPOSED_BY]->(b:Service)
        RETURN COALESCE(a.id, a.name) AS sourceId, COALESCE(b.id, b.name) AS targetId, 'EXPOSED_BY' AS type
      `);

      const enrichResult = await session.run(`
        MATCH (s:Service)
        OPTIONAL MATCH (p:Project)-[:DEPLOYED_ON]->(s)
        OPTIONAL MATCH (t:Team)-[:OWNS]->(p)
        RETURN s.name AS serviceName, p.name AS projectName, t.name AS teamName
      `);

      const teams = teamsResult.records.map(r => {
        const tProps = r.get('t').properties;
        return {
          ...tProps,
          id: tProps.id || tProps.name,
          nodeType: 'TEAM',
        };
      });
      const projects = projectsResult.records.map(r => {
        const pProps = r.get('p').properties;
        return {
          ...pProps,
          id: pProps.id || pProps.name,
          nodeType: 'PROJECT',
        };
      });

      const serviceEnrichment: Record<string, { projectName?: string; teamName?: string }> = {};
      enrichResult.records.forEach(r => {
        const sName = r.get('serviceName');
        if (sName) {
          serviceEnrichment[sName] = {
            projectName: r.get('projectName') ?? undefined,
            teamName: r.get('teamName') ?? undefined,
          };
        }
      });

      const services = servicesResult.records.map(r => {
        const sProps = r.get('s').properties;
        return {
          ...sProps,
          id: sProps.id || sProps.name,
          nodeType: 'SERVICE',
          ...serviceEnrichment[sProps.name],
        };
      });

      const edges = edgesResult.records.map(r => ({
        sourceId: r.get('sourceId'),
        targetId: r.get('targetId'),
        type: r.get('type'),
      }));

      return serializeNeo4jResponse({ nodes: [...teams, ...projects, ...services], edges });
    } finally {
      await session.close();
    }
  },
};
