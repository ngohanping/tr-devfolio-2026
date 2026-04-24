import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ArchitectureEdge, ArchitectureNode, NodeType, ServiceWithRelations, ProjectWithRelations } from '../../shared/models/architecture-node.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ArchitectureService {
  private readonly apiService = inject(ApiService);

  private readonly canvasNodes$ = new BehaviorSubject<ArchitectureNode[]>([]);
  private readonly edges$ = new BehaviorSubject<ArchitectureEdge[]>([]);
  private readonly allApiServices$ = new BehaviorSubject<ArchitectureNode[]>([]);
  private readonly loading$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);

  constructor() {}

  loadForProject(project: ProjectWithRelations): void {
    this.loading$.next(true);
    this.error$.next(null);
    this.canvasNodes$.next([]);
    this.edges$.next([]);
    const nodes = project.services.map((svc, i) => this.mapToNode(svc, i));
    const edges = this.deriveEdges(project.services);
    this.allApiServices$.next(nodes);
    this.canvasNodes$.next(nodes);
    this.edges$.next(edges);
    this.loading$.next(false);
  }

  reset(): void {
    this.canvasNodes$.next([]);
    this.edges$.next([]);
    this.allApiServices$.next([]);
    this.error$.next(null);
  }

  private mapToNode(svc: ServiceWithRelations, index: number): ArchitectureNode {
    const col = index % 4;
    const row = Math.floor(index / 4);
    return {
      id: svc.id,
      type: this.normalizeNodeType(svc.type),
      name: svc.name,
      subtitle: this.buildSubtitle(svc),
      tags: svc.tags,
      status: svc.status === 'restricted' ? 'active' : svc.status,
      position: { x: 200 + col * 220, y: 200 + row * 160 },
    };
  }

  private normalizeNodeType(backendType: string): NodeType {
    const typeMap: Record<string, NodeType> = {
      SERVICE: 'SERVICE',
      DATABASE: 'DATABASE',
      WORKER: 'WORKER',
      PROPOSED: 'PROPOSED',
      aws_lambda: 'WORKER',
      api_gateway: 'SERVICE',
      'api-gateway': 'SERVICE',
      external_service: 'SERVICE',
    };
    return typeMap[backendType] || 'SERVICE';
  }

  private buildSubtitle(svc: ServiceWithRelations): string {
    const parts: string[] = [];
    if (svc.version) parts.push(svc.version);
    if (svc.project?.name) parts.push(svc.project.name);
    return parts.join(' • ') || svc.description || svc.type;
  }

  private deriveEdges(services: ServiceWithRelations[]): ArchitectureEdge[] {
    const edges: ArchitectureEdge[] = [];
    const seen = new Set<string>();
    for (const svc of services) {
      const calls = Array.isArray(svc.calls) ? svc.calls : [];
      for (const callee of calls) {
        if (callee && callee.id && svc.id) {
          const key = `${svc.id}__${callee.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push({ id: `edge-${svc.id}-${callee.id}`, sourceId: svc.id, targetId: callee.id });
          }
        }
      }
    }
    return edges;
  }

  getCanvasNodes$(): Observable<ArchitectureNode[]> {
    return this.canvasNodes$.asObservable();
  }

  getMarketplaceServices$(): Observable<ArchitectureNode[]> {
    return this.allApiServices$.asObservable();
  }

  getEdges$(): Observable<ArchitectureEdge[]> {
    return this.edges$.asObservable();
  }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError$(): Observable<string | null> {
    return this.error$.asObservable();
  }

  updateNodePosition(id: string, position: { x: number; y: number }): void {
    const current = this.canvasNodes$.getValue();
    const updated = current.map(n => (n.id === id ? { ...n, position } : n));
    this.canvasNodes$.next(updated);
  }

  addNodeToCanvas(node: ArchitectureNode): void {
    const current = this.canvasNodes$.getValue();
    this.canvasNodes$.next([...current, node]);
  }

  removeNode(id: string): void {
    this.canvasNodes$.next(this.canvasNodes$.getValue().filter(n => n.id !== id));
    this.edges$.next(this.edges$.getValue().filter(e => e.sourceId !== id && e.targetId !== id));
  }

  addEdge(sourceId: string, targetId: string): void {
    if (sourceId === targetId) return;
    const current = this.edges$.getValue();
    const isDuplicate = current.some(e => e.sourceId === sourceId && e.targetId === targetId);
    if (isDuplicate) return;
    const edge: ArchitectureEdge = { id: `edge-${sourceId}-${targetId}-${Date.now()}`, sourceId, targetId };
    this.edges$.next([...current, edge]);
  }

  removeEdge(edgeId: string): void {
    this.edges$.next(this.edges$.getValue().filter(e => e.id !== edgeId));
  }
}
