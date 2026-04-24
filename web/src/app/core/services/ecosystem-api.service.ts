import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { EcosystemGraph, EcosystemNode, EcosystemEdge } from '../../shared/models/ecosystem.model';

@Injectable({ providedIn: 'root' })
export class EcosystemApiService {
  private readonly http = inject(HttpClient);
  private readonly graph$ = new BehaviorSubject<EcosystemGraph | null>(null);
  private readonly loading$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);

  getEcosystem$(): Observable<EcosystemGraph | null> {
    return this.graph$.asObservable();
  }

  isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError$(): Observable<string | null> {
    return this.error$.asObservable();
  }

  fetchEcosystem(): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.http
      .get<{ data: { nodes: EcosystemNode[]; edges: Omit<EcosystemEdge, 'id'>[] } }>('/api/ecosystem')
      .pipe(
        catchError(() => {
          this.error$.next('Could not reach API — showing mock data.');
          return of(MOCK_ECOSYSTEM_RESPONSE);
        })
      )
      .subscribe(response => {
        const edges: EcosystemEdge[] = response.data.edges.map(e => ({
          ...e,
          id: `${e.sourceId}--${e.type}--${e.targetId}`,
        }));
        this.graph$.next({ nodes: response.data.nodes, edges });
        this.loading$.next(false);
      });
  }
}

const MOCK_ECOSYSTEM_RESPONSE = {
  data: {
    nodes: [
      { id: 't1', nodeType: 'TEAM' as const, name: 'Platform Team', lead: 'Alice' },
      { id: 't2', nodeType: 'TEAM' as const, name: 'Data Team', lead: 'Bob' },
      { id: 'p1', nodeType: 'PROJECT' as const, name: 'Auth System', teamId: 't1' },
      { id: 'p2', nodeType: 'PROJECT' as const, name: 'Analytics Pipeline', teamId: 't2' },
      { id: 's1', nodeType: 'SERVICE' as const, name: 'User Service', type: 'SERVICE', status: 'active', projectName: 'Auth System', teamName: 'Platform Team' },
      { id: 's2', nodeType: 'SERVICE' as const, name: 'Postgres DB', type: 'DATABASE', status: 'active', projectName: 'Auth System', teamName: 'Platform Team' },
      { id: 's3', nodeType: 'SERVICE' as const, name: 'Analytics Worker', type: 'WORKER', status: 'active', projectName: 'Analytics Pipeline', teamName: 'Data Team' },
    ],
    edges: [
      { sourceId: 't1', targetId: 'p1', type: 'OWNS' as const },
      { sourceId: 't2', targetId: 'p2', type: 'OWNS' as const },
      { sourceId: 'p1', targetId: 's1', type: 'DEPLOYED_ON' as const },
      { sourceId: 'p1', targetId: 's2', type: 'DEPLOYED_ON' as const },
      { sourceId: 'p2', targetId: 's3', type: 'DEPLOYED_ON' as const },
      { sourceId: 's1', targetId: 's2', type: 'CALLS' as const },
    ],
  },
};
