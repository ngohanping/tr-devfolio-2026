import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { EcosystemApiService } from '../../core/services/ecosystem-api.service';
import {
  EcosystemNode,
  EcosystemEdge,
  EcosystemGraph,
  PositionedProjectNode,
  MergedServiceNode,
  EcosystemEdgeType,
} from '../../shared/models/ecosystem.model';

@Component({
  selector: 'app-ecosystem-view',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './ecosystem-view.component.html',
  styleUrl: './ecosystem-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcosystemViewComponent implements OnInit {
  private readonly ecosystemApiService = inject(EcosystemApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly isLoading$ = this.ecosystemApiService.isLoading$();
  readonly error$ = this.ecosystemApiService.getError$();

  projectNodes: PositionedProjectNode[] = [];
  serviceNodes: MergedServiceNode[] = [];
  edges: EcosystemEdge[] = [];
  canvasHeight = 800;
  canvasWidth = 1000;

  readonly CARD_WIDTH = 220;
  readonly CARD_HEIGHT = 160;
  readonly COLS = 4;
  readonly COL_GAP = 80;
  readonly ROW_GAP = 80;
  readonly CANVAS_PAD = 60;
  readonly SECTION_GAP = 150;

  readonly LEGEND_NODES: { label: string; borderClass: string }[] = [
    { label: 'Service', borderClass: 'border-green-500' },
    { label: 'Proposed', borderClass: 'border-orange-500' },
  ];

  readonly LEGEND_EDGES: { label: string; color: string; dashed: boolean }[] = [
    { label: 'CALLS', color: '#22c55e', dashed: false },
  ];

  ngOnInit(): void {
    this.ecosystemApiService.getEcosystem$()
      .pipe(filter((graph): graph is EcosystemGraph => graph !== null))
      .subscribe(graph => {
        this.edges = this.prepareEdges(graph.edges, graph.nodes);
        this.layoutNodes(graph.nodes);
        this.cdr.markForCheck();
      });
    this.ecosystemApiService.fetchEcosystem();
  }

  private layoutNodes(nodes: EcosystemNode[]): void {
    const services = nodes.filter(n => n.nodeType === 'SERVICE');
    this.projectNodes = [];

    // Calculate topological levels based on call graph (reverse depth from leaf nodes)
    const callEdges = this.edges.filter(e => e.type === 'CALLS');

    // Build adjacency lists for the call graph
    const outgoing = new Map<string, string[]>();
    const incoming = new Map<string, string[]>();

    services.forEach(s => {
      outgoing.set(s.id, []);
      incoming.set(s.id, []);
    });

    callEdges.forEach(e => {
      if (outgoing.has(e.sourceId) && outgoing.has(e.targetId)) {
        outgoing.get(e.sourceId)!.push(e.targetId);
        incoming.get(e.targetId)!.push(e.sourceId);
      }
    });

    // Calculate depth: distance from leaf nodes (sinks with out-degree 0)
    const depth = new Map<string, number>();
    const calculateDepth = (nodeId: string, visited = new Set<string>()): number => {
      if (depth.has(nodeId)) return depth.get(nodeId)!;
      if (visited.has(nodeId)) return 0; // Cycle detection

      visited.add(nodeId);
      const targets = outgoing.get(nodeId) || [];

      if (targets.length === 0) {
        depth.set(nodeId, 0); // Leaf node
      } else {
        const maxChildDepth = Math.max(...targets.map(t => calculateDepth(t, new Set(visited))));
        depth.set(nodeId, maxChildDepth + 1);
      }

      return depth.get(nodeId)!;
    };

    services.forEach(s => calculateDepth(s.id));

    // Group services by depth level (deeper levels = further left/higher priority)
    const levelGroups = new Map<number, EcosystemNode[]>();
    services.forEach(s => {
      const level = depth.get(s.id) || 0;
      if (!levelGroups.has(level)) levelGroups.set(level, []);
      levelGroups.get(level)!.push(s);
    });

    // Sort levels in descending order (high depth on left)
    const sortedLevels = Array.from(levelGroups.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([_, services]) => services.sort((a, b) => a.name.localeCompare(b.name)));

    this.serviceNodes = [];
    let xPos = this.CANVAS_PAD;

    sortedLevels.forEach(levelServices => {
      levelServices.forEach((svc, i) => {
        this.serviceNodes.push({
          ...svc,
          id: svc.id,
          displayName: svc.name,
          count: 1,
          memberNames: [svc.name],
          memberIds: svc.id ? [svc.id] : [],
          x: xPos,
          y: this.CANVAS_PAD + (i % 2) * (this.CARD_HEIGHT + this.ROW_GAP),
        } as MergedServiceNode);
      });
      xPos += this.CARD_WIDTH + this.COL_GAP;
    });

    const maxServicesPerLevel = Math.max(...sortedLevels.map(l => l.length));
    const totalHeight = this.CANVAS_PAD * 2 +
                       Math.ceil(maxServicesPerLevel / 1) * (this.CARD_HEIGHT + this.ROW_GAP);
    const totalWidth = this.CANVAS_PAD * 2 +
                      sortedLevels.length * (this.CARD_WIDTH + this.COL_GAP);

    this.canvasWidth = Math.max(1000, totalWidth);
    this.canvasHeight = totalHeight;
  }

  private normalizeType(type: string | undefined): string {
    return (type ?? 'unknown').toLowerCase().replace(/-/g, '_');
  }

  private formatDisplayName(normalizedType: string): string {
    return normalizedType
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private prepareEdges(rawEdges: EcosystemEdge[], nodes: EcosystemNode[]): EcosystemEdge[] {
    const serviceIds = new Set(nodes.filter(n => n.nodeType === 'SERVICE').map(s => s.id));
    const seen = new Set<string>();
    const processed: EcosystemEdge[] = [];

    for (const edge of rawEdges) {
      if (!edge.sourceId || !edge.targetId) continue;
      // Only include CALLS edges between services
      if (!serviceIds.has(edge.sourceId) || !serviceIds.has(edge.targetId)) continue;
      if (edge.type !== 'CALLS') continue;

      const key = `${edge.sourceId}--${edge.type}--${edge.targetId}`;
      if (!seen.has(key)) {
        seen.add(key);
        processed.push(edge);
      }
    }

    return processed;
  }

  getAllNodes(): (PositionedProjectNode | MergedServiceNode)[] {
    return [...this.projectNodes, ...this.serviceNodes];
  }

  getEdgePath(edge: EcosystemEdge): string {
    const allNodes = this.getAllNodes();
    const source = allNodes.find(n => n.id === edge.sourceId);
    const target = allNodes.find(n => n.id === edge.targetId);
    if (!source || !target) return '';

    const exitRight = target.x > source.x;
    const x1 = exitRight ? source.x + this.CARD_WIDTH : source.x;
    const y1 = source.y + this.CARD_HEIGHT / 2;
    const x2 = exitRight ? target.x : target.x + this.CARD_WIDTH;
    const y2 = target.y + this.CARD_HEIGHT / 2;

    const mx = (x1 + x2) / 2;
    return `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }

  getEdgeMidpoint(edge: EcosystemEdge): { x: number; y: number } | null {
    const allNodes = this.getAllNodes();
    const source = allNodes.find(n => n.id === edge.sourceId);
    const target = allNodes.find(n => n.id === edge.targetId);
    if (!source || !target) return null;

    const exitRight = target.x > source.x;
    const x1 = exitRight ? source.x + this.CARD_WIDTH : source.x;
    const y1 = source.y + this.CARD_HEIGHT / 2;
    const x2 = exitRight ? target.x : target.x + this.CARD_WIDTH;
    const y2 = target.y + this.CARD_HEIGHT / 2;

    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 8 };
  }

  getEdgeColor(type: EcosystemEdgeType): string {
    const colors: Record<EcosystemEdgeType, string> = {
      OWNS: '#FFD900',
      DEPLOYED_ON: '#6366f1',
      CALLS: '#22c55e',
      EXPOSED_BY: '#f97316',
    };
    return colors[type];
  }

  getEdgeDashArray(type: EcosystemEdgeType): string {
    return type === 'EXPOSED_BY' ? '6 3' : 'none';
  }

  getNodeCardBorderClass(node: PositionedProjectNode | MergedServiceNode): string {
    if ('nodeType' in node) {
      if (node.nodeType === 'PROJECT') return 'border-blue-500';
      if (node.type === 'PROPOSED') return 'border-orange-500';
    }
    return 'border-green-500';
  }

  trackById(_index: number, node: { id: string }): string {
    return node.id;
  }

  trackByEdgeId(_index: number, edge: EcosystemEdge): string {
    return edge.id;
  }

  trackByName(_index: number, name: string): string {
    return name;
  }
}
