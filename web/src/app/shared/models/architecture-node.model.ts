export type NodeType = 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
export type NodeStatus = 'active' | 'proposed' | 'restricted';

export interface ArchitectureNode {
  id: string;
  type: NodeType;
  name: string;
  subtitle: string;
  tags?: string[];
  status: NodeStatus;
  position: { x: number; y: number };
}
