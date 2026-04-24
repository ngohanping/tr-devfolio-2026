export type EcosystemDomain = 'Operations' | 'Engineering' | 'Data' | 'Platform' | 'Security';
export type BlueprintType = 'MICROSERVICE' | 'FRONTEND_APP' | 'DATA_PIPELINE';
export type SquadStatus = 'stable' | 'degraded' | 'proposed';

export interface Squad {
  id: string;
  name: string;
  domain: EcosystemDomain;
  technicalLead: string;
  blueprintType: BlueprintType;
  serviceCount: number;
  status: SquadStatus;
}

export interface RegisterSquadPayload {
  name: string;
  domain: EcosystemDomain;
  technicalLead: string;
  blueprintType: BlueprintType;
}
