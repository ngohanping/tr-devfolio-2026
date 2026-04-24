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
