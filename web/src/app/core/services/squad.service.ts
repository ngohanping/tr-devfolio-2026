import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';
import { RegisterSquadPayload, Squad, SquadStatus } from '../../shared/models/squad.model';

interface ApiTeam {
  id: string;
  name: string;
  description?: string | null;
  lead?: string | null;
  members?: string[];
  projects?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

function mapApiTeamToSquad(team: ApiTeam): Squad {
  return {
    id: team.id,
    name: team.name,
    domain: (team.description as Squad['domain']) ?? 'Operations',
    technicalLead: team.lead ?? 'Unassigned',
    blueprintType: 'MICROSERVICE',
    serviceCount: team.projects?.length ?? 0,
    status: (team.projects?.length ?? 0) > 0 ? 'stable' : ('proposed' as SquadStatus),
  };
}

@Injectable({ providedIn: 'root' })
export class SquadService {
  private readonly http = inject(HttpClient);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  getSquads$(): Observable<Squad[]> {
    return this.refresh$.pipe(
      switchMap(() => this.http.get<{ data: ApiTeam[] }>('/api/teams')),
      map(res => res.data.map(mapApiTeamToSquad)),
    );
  }

  registerSquad$(payload: RegisterSquadPayload): Observable<Squad> {
    const body = {
      name: payload.name,
      lead: payload.technicalLead,
      members: [],
      description: payload.domain,
    };
    return this.http.post<{ data: ApiTeam }>('/api/teams', body).pipe(
      map(res => ({
        ...mapApiTeamToSquad(res.data),
        domain: payload.domain,
        blueprintType: payload.blueprintType,
        status: 'proposed' as SquadStatus,
      })),
      tap(() => this.refresh$.next()),
    );
  }
}
