import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArchitectureNode } from '../../shared/models/architecture-node.model';

const MOCK_CANVAS_NODES: ArchitectureNode[] = [
  {
    id: 'auth-gateway',
    type: 'SERVICE',
    name: 'Auth-Gateway',
    subtitle: 'v2.4.1 • k8s-cluster-01',
    status: 'active',
    position: { x: 260, y: 480 },
  },
  {
    id: 'centralized-api',
    type: 'PROPOSED',
    name: 'Centralized-API',
    subtitle: 'PR #882 • Pending Review',
    status: 'proposed',
    position: { x: 460, y: 480 },
  },
  {
    id: 'user-store-db',
    type: 'DATABASE',
    name: 'User-Store-DB',
    subtitle: 'Postgres 14 • Multi-AZ',
    status: 'active',
    position: { x: 720, y: 410 },
  },
  {
    id: 'email-service',
    type: 'WORKER',
    name: 'Email-Service',
    subtitle: 'NodeJS • Event-Driven',
    status: 'active',
    position: { x: 720, y: 550 },
  },
];

const MOCK_MARKETPLACE_SERVICES: ArchitectureNode[] = [
  {
    id: 'mp-centralized-api',
    type: 'SERVICE',
    name: 'Centralized-API',
    subtitle: 'Core Infrastructure',
    tags: ['REST', 'V3.0'],
    status: 'active',
    position: { x: 0, y: 0 },
  },
  {
    id: 'mp-identity-provider',
    type: 'SERVICE',
    name: 'Identity-Provider',
    subtitle: 'Security Layer',
    tags: ['AUTH', 'TIER-1'],
    status: 'active',
    position: { x: 0, y: 0 },
  },
  {
    id: 'mp-telemetry-hub',
    type: 'SERVICE',
    name: 'Telemetry-Hub',
    subtitle: 'Observability',
    tags: ['GRPC', 'GLOBAL'],
    status: 'active',
    position: { x: 0, y: 0 },
  },
  {
    id: 'mp-vault-manager',
    type: 'SERVICE',
    name: 'Vault-Manager',
    subtitle: 'Secrets',
    status: 'restricted',
    position: { x: 0, y: 0 },
  },
];

@Injectable({
  providedIn: 'root',
})
export class ArchitectureService {
  private canvasNodes$ = new BehaviorSubject<ArchitectureNode[]>(MOCK_CANVAS_NODES);

  getCanvasNodes$(): Observable<ArchitectureNode[]> {
    return this.canvasNodes$.asObservable();
  }

  getMarketplaceServices$(): Observable<ArchitectureNode[]> {
    return new BehaviorSubject<ArchitectureNode[]>(MOCK_MARKETPLACE_SERVICES).asObservable();
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
}
