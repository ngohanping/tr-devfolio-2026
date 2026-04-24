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
      { id: 't1', nodeType: 'TEAM' as const, name: 'Booking Team', lead: 'Alice' },
      { id: 't2', nodeType: 'TEAM' as const, name: 'Central Engine Team', lead: 'Bob' },
      { id: 'p1', nodeType: 'PROJECT' as const, name: 'Booking Application', teamId: 't1' },
      { id: 'p2', nodeType: 'PROJECT' as const, name: 'Central Booking Engine', teamId: 't2' },
      // Booking Application services
      { id: 's1', nodeType: 'SERVICE' as const, name: 'API Gateway', type: 'SERVICE', status: 'active', projectName: 'Booking Application', teamName: 'Booking Team' },
      { id: 's2', nodeType: 'SERVICE' as const, name: 'Lambda Function', type: 'WORKER', status: 'active', projectName: 'Booking Application', teamName: 'Booking Team' },
      // Central Booking Engine services
      { id: 's3', nodeType: 'SERVICE' as const, name: 'API Gateway', type: 'SERVICE', status: 'active', projectName: 'Central Booking Engine', teamName: 'Central Engine Team' },
      { id: 's4', nodeType: 'SERVICE' as const, name: 'Lambda Function', type: 'WORKER', status: 'active', projectName: 'Central Booking Engine', teamName: 'Central Engine Team' },
      // External Service Provider
      { id: 's5', nodeType: 'SERVICE' as const, name: 'External Service Provider', type: 'SERVICE', status: 'active' },
    ],
    edges: [
      { sourceId: 't1', targetId: 'p1', type: 'OWNS' as const },
      { sourceId: 't2', targetId: 'p2', type: 'OWNS' as const },
      { sourceId: 'p1', targetId: 's1', type: 'DEPLOYED_ON' as const },
      { sourceId: 'p1', targetId: 's2', type: 'DEPLOYED_ON' as const },
      { sourceId: 'p2', targetId: 's3', type: 'DEPLOYED_ON' as const },
      { sourceId: 'p2', targetId: 's4', type: 'DEPLOYED_ON' as const },
      // Call chain
      { sourceId: 's1', targetId: 's2', type: 'CALLS' as const },
      { sourceId: 's2', targetId: 's3', type: 'CALLS' as const },
      { sourceId: 's3', targetId: 's4', type: 'CALLS' as const },
      { sourceId: 's4', targetId: 's5', type: 'CALLS' as const },
    ],
  },
};
