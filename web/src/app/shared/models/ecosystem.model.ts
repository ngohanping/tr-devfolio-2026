export type EcosystemNodeType = 'TEAM' | 'PROJECT' | 'SERVICE';
export type EcosystemEdgeType = 'OWNS' | 'DEPLOYED_ON' | 'CALLS' | 'EXPOSED_BY';

export interface EcosystemNode {
  id: string;
  nodeType: EcosystemNodeType;
  name: string;
  description?: string;
  lead?: string;           // team
  teamId?: string;         // project
  status?: string;         // service
  type?: string;           // service: SERVICE | DATABASE | WORKER | PROPOSED
  tags?: string[];         // service
  version?: string;        // service
  projectName?: string;    // service enrichment
  teamName?: string;       // service enrichment
}

export interface EcosystemEdge {
  id: string;              // synthesized: `${sourceId}--${type}--${targetId}`
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
  serviceCount: number;  // how many services deployed by this project
}

export interface MergedServiceNode extends PositionedEcosystemNode {
  displayName: string;
  count: number;
  memberNames: string[];
  memberIds: string[];
}
