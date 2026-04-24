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
    { label: 'Project', borderClass: 'border-blue-500' },
    { label: 'Service', borderClass: 'border-green-500' },
    { label: 'Proposed', borderClass: 'border-orange-500' },
  ];

  readonly LEGEND_EDGES: { label: string; color: string; dashed: boolean }[] = [
    { label: 'DEPLOYED_ON', color: '#6366f1', dashed: false },
    { label: 'CALLS', color: '#22c55e', dashed: false },
    { label: 'EXPOSED_BY', color: '#f97316', dashed: true },
  ];

  ngOnInit(): void {
    this.ecosystemApiService.getEcosystem$()
      .pipe(filter((graph): graph is EcosystemGraph => graph !== null))
      .subscribe(graph => {
        this.edges = this.prepareEdges(graph.edges);
        this.layoutNodes(graph.nodes);
        this.cdr.markForCheck();
      });
    this.ecosystemApiService.fetchEcosystem();
  }

  private layoutNodes(nodes: EcosystemNode[]): void {
    const projects = nodes.filter(n => n.nodeType === 'PROJECT').sort((a, b) => a.name.localeCompare(b.name));
    const projectCols = Math.min(this.COLS, projects.length) || 1;

    this.projectNodes = projects.map((p, i) => {
      const serviceCount = 0;
      return {
        ...p,
        x: this.CANVAS_PAD + (i % projectCols) * (this.CARD_WIDTH + this.COL_GAP),
        y: this.CANVAS_PAD,
        serviceCount,
      } as PositionedProjectNode;
    });

    const services = nodes.filter(n => n.nodeType === 'SERVICE');
    const groups = new Map<string, EcosystemNode[]>();
    for (const svc of services) {
      const key = this.normalizeType(svc.type);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(svc);
    }

    const servicesCols = Math.min(this.COLS, groups.size) || 1;
    const servicesTopY = this.CANVAS_PAD + this.CARD_HEIGHT + this.SECTION_GAP;

    this.serviceNodes = [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([normalizedType, members], i) => {
        const first = members[0];
        return {
          ...first,
          id: `merged-${normalizedType}`,
          name: this.formatDisplayName(normalizedType),
          displayName: this.formatDisplayName(normalizedType),
          count: members.length,
          memberNames: members.map(m => m.name),
          memberIds: members.map(m => m.id).filter((id): id is string => id !== null && id !== undefined),
          x: this.CANVAS_PAD + (i % servicesCols) * (this.CARD_WIDTH + this.COL_GAP),
          y: servicesTopY + Math.floor(i / servicesCols) * (this.CARD_HEIGHT + this.ROW_GAP),
        } as MergedServiceNode;
      });

    const projectRows = Math.ceil(projects.length / projectCols);
    const serviceRows = Math.ceil(this.serviceNodes.length / servicesCols);
    const totalHeight = this.CANVAS_PAD * 2 +
                       (projectRows * this.CARD_HEIGHT) +
                       this.SECTION_GAP +
                       (serviceRows * (this.CARD_HEIGHT + this.ROW_GAP));
    const totalWidth = this.CANVAS_PAD * 2 +
                      Math.max(projectCols, servicesCols) * (this.CARD_WIDTH + this.COL_GAP) -
                      this.COL_GAP;

    this.canvasWidth = Math.max(1000, totalWidth);
    this.canvasHeight = totalHeight;

    const projectServiceMap = new Map<string, number>();
    for (const p of this.projectNodes) {
      projectServiceMap.set(p.id, 0);
    }
    this.edges.forEach(e => {
      if (e.type === 'DEPLOYED_ON' && this.projectNodes.some(p => p.id === e.sourceId)) {
        projectServiceMap.set(e.sourceId, (projectServiceMap.get(e.sourceId) ?? 0) + 1);
      }
    });
    this.projectNodes.forEach(p => {
      p.serviceCount = projectServiceMap.get(p.id) ?? 0;
    });
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

  private prepareEdges(rawEdges: EcosystemEdge[]): EcosystemEdge[] {
    const memberToMerged = new Map<string, string>();
    for (const node of this.serviceNodes) {
      for (const memberId of node.memberIds) {
        memberToMerged.set(memberId, node.id);
      }
    }

    const seen = new Set<string>();
    const processed: EcosystemEdge[] = [];

    for (const edge of rawEdges) {
      if (!edge.sourceId || !edge.targetId) continue;

      let src = edge.sourceId;
      let tgt = edge.targetId;

      if (edge.type === 'CALLS' || edge.type === 'EXPOSED_BY') {
        src = memberToMerged.get(src) ?? src;
        tgt = memberToMerged.get(tgt) ?? tgt;
        if (src === tgt) continue;
      } else if (edge.type === 'DEPLOYED_ON') {
        tgt = memberToMerged.get(tgt) ?? tgt;
      }

      const key = `${src}--${edge.type}--${tgt}`;
      if (!seen.has(key)) {
        seen.add(key);
        processed.push({ id: key, sourceId: src, targetId: tgt, type: edge.type });
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
