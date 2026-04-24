export type NodeType = 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
export type NodeStatus = 'active' | 'proposed';
export type BackendServiceStatus = 'active' | 'proposed' | 'restricted';

export interface ArchitectureNode {
  id: string;
  type: NodeType;
  name: string;
  subtitle: string;
  tags?: string[];
  status: NodeStatus;
  position: { x: number; y: number };
}

export interface ArchitectureEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface BackendProject {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendService {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: BackendServiceStatus;
  teamId?: string;
  tags?: string[];
  version?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWithRelations extends BackendService {
  project: BackendProject | null;
  calls: BackendService[];
  calledBy: BackendService[];
  exposedBy: BackendService[];
}

export interface ServicesApiResponse {
  data: ServiceWithRelations[];
}

export interface ProjectWithRelations {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  team: { id: string; name: string } | null;
  services: ServiceWithRelations[];
}

export interface FrontendProject {
  id: string;
  name: string;
  description?: string;
  serviceCount: number;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}
