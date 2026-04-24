export interface Service {
  id: string;
  name: string;
  type: 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
  description?: string;
  status: 'active' | 'proposed' | 'restricted';
  teamId?: string;
  tags?: string[];
  version?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  lead?: string;
  members?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServicePayload {
  name: string;
  type: 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
  description?: string;
  status?: 'active' | 'proposed' | 'restricted';
  teamId?: string;
  tags?: string[];
  version?: string;
}

export interface UpdateServicePayload {
  name?: string;
  type?: 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
  description?: string;
  status?: 'active' | 'proposed' | 'restricted';
  teamId?: string;
  tags?: string[];
  version?: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  lead?: string;
  members?: string[];
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
  lead?: string;
  members?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  teamId: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  teamId?: string;
}

export interface ServiceRelation {
  id: string;
  sourceServiceId: string;
  targetServiceId: string;
  type: 'CALLS' | 'EXPOSED_BY';
  createdAt: Date;
}

export interface ProjectServiceRelation {
  id: string;
  projectId: string;
  serviceId: string;
  type: 'DEPLOYED_ON';
  createdAt: Date;
}

export interface TeamProjectRelation {
  id: string;
  teamId: string;
  projectId: string;
  type: 'OWNS';
  createdAt: Date;
}

export interface TeamWithRelations extends Team {
  projects: Project[];
}

export interface ProjectWithRelations extends Project {
  team: Team | null;
  services: Service[];
}

export interface ServiceWithRelations extends Service {
  project: Project | null;
  calls: Service[];
  calledBy: Service[];
  exposedBy: Service[];
}
