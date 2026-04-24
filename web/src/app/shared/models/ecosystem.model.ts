export type EcosystemNodeType = 'TEAM' | 'PROJECT' | 'SERVICE';
export type EcosystemEdgeType = 'OWNS' | 'DEPLOYED_ON' | 'CALLS' | 'EXPOSED_BY';

export interface EcosystemNode {
  id: string;
  nodeType: EcosystemNodeType;
  name: string;
  description?: string;
  lead?: string;
  teamId?: string;
  status?: string;
  type?: string;
  tags?: string[];
  version?: string;
  projectName?: string;
  teamName?: string;
}

export interface EcosystemEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: EcosystemEdgeType;
}

export interface EcosystemGraph {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
}

export interface PositionedEcosystemNode extends EcosystemNode {
  x: number;
  y: number;
}

export interface PositionedProjectNode extends PositionedEcosystemNode {
  serviceCount: number;
}

export interface MergedServiceNode extends PositionedEcosystemNode {
  displayName: string;
  count: number;
  memberNames: string[];
  memberIds: string[];
}
