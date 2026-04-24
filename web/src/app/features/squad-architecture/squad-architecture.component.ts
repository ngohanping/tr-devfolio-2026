import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Observable, combineLatest, finalize } from 'rxjs';
import { take } from 'rxjs/operators';

import { ArchitectureService } from '../../core/services/architecture.service';
import { ExportService } from '../../core/services/export.service';
import { ApiService } from '../../core/services/api.service';
import { NodeCardComponent } from '../../shared/components/node-card/node-card.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { ArchitectureEdge, ArchitectureNode, FrontendProject, CreateProjectPayload, ProjectWithRelations } from '../../shared/models/architecture-node.model';

export interface CanvasState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 110;

@Component({
  selector: 'app-squad-architecture',
  imports: [AsyncPipe, FormsModule, CdkDrag, NodeCardComponent, ProjectListComponent, CreateProjectModalComponent],
  templateUrl: './squad-architecture.component.html',
  styleUrl: './squad-architecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquadArchitectureComponent implements OnInit {
  private readonly architectureService = inject(ArchitectureService);
  private readonly exportService = inject(ExportService);
  private readonly apiService = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('canvasContainer') canvasContainerRef!: ElementRef<HTMLElement>;

  // Project list state
  projects: FrontendProject[] = [];
  selectedProject: FrontendProject | null = null;
  showCreateModal = false;
  projectsLoading = false;
  projectsError: string | null = null;
  isSubmittingCreate = false;

  // Canvas state
  canvasState$!: Observable<CanvasState>;
  marketplaceServices$!: Observable<ArchitectureNode[]>;
  marketplaceFilter = '';

  isMarketplaceOpen = true;
  isConnectionMode = false;
  connectionSourceId: string | null = null;

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsLoading = true;
    this.cdr.markForCheck();
    this.apiService.getProjects().pipe(
      take(1),
      finalize(() => {
        this.projectsLoading = false;
        this.cdr.markForCheck();
      }),
    ).subscribe({
      next: (res) => {
        this.projects = res.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          serviceCount: p.services.length,
        }));
      },
      error: (err: any) => {
        this.projectsError = err.message ?? 'Failed to load projects';
      },
    });
  }

  onLoadProject(project: FrontendProject): void {
    this.apiService.getProject(project.id).pipe(take(1)).subscribe({
      next: (res) => {
        this.architectureService.loadForProject(res.data);
        this.selectedProject = project;
        this.canvasState$ = combineLatest({
          nodes: this.architectureService.getCanvasNodes$(),
          edges: this.architectureService.getEdges$(),
        });
        this.marketplaceServices$ = this.architectureService.getMarketplaceServices$();
        this.cdr.markForCheck();
      },
    });
  }

  onBackToProjects(): void {
    this.selectedProject = null;
    this.architectureService.reset();
    this.cdr.markForCheck();
  }

  onNewProject(): void {
    this.showCreateModal = true;
    this.cdr.markForCheck();
  }

  onModalCancelled(): void {
    this.showCreateModal = false;
    this.cdr.markForCheck();
  }

  onCreateProjectSubmitted(payload: CreateProjectPayload): void {
    this.isSubmittingCreate = true;
    this.cdr.markForCheck();
    this.apiService.createProject(payload).pipe(
      take(1),
      finalize(() => {
        this.isSubmittingCreate = false;
        this.cdr.markForCheck();
      }),
    ).subscribe({
      next: (res) => {
        this.showCreateModal = false;
        const newProjectFull: ProjectWithRelations = {
          ...res.data,
          team: null,
          services: [],
          createdAt: '',
          updatedAt: '',
        };
        this.architectureService.loadForProject(newProjectFull);
        this.selectedProject = {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          serviceCount: 0,
        };
        this.projects = [this.selectedProject, ...this.projects];
        this.canvasState$ = combineLatest({
          nodes: this.architectureService.getCanvasNodes$(),
          edges: this.architectureService.getEdges$(),
        });
        this.marketplaceServices$ = this.architectureService.getMarketplaceServices$();
      },
    });
  }

  trackByProjectId(_index: number, project: FrontendProject): string {
    return project.id;
  }

  @HostListener('document:keydown.escape')
  cancelConnectionMode(): void {
    this.isConnectionMode = false;
    this.connectionSourceId = null;
    this.cdr.markForCheck();
  }

  toggleMarketplace(): void {
    this.isMarketplaceOpen = !this.isMarketplaceOpen;
    this.cdr.markForCheck();
  }

  onConnectSelected(nodeId: string): void {
    if (!this.isConnectionMode) {
      this.isConnectionMode = true;
      this.connectionSourceId = nodeId;
    } else if (this.connectionSourceId === nodeId) {
      this.cancelConnectionMode();
      return;
    } else {
      this.architectureService.addEdge(this.connectionSourceId!, nodeId);
      this.isConnectionMode = false;
      this.connectionSourceId = null;
    }
    this.cdr.markForCheck();
  }

  onRemoveNode(nodeId: string): void {
    this.architectureService.removeNode(nodeId);
    if (this.connectionSourceId === nodeId) {
      this.isConnectionMode = false;
      this.connectionSourceId = null;
      this.cdr.markForCheck();
    }
  }

  // cdkDragFreeDragPosition owns the visual transform — getFreeDragPosition() returns
  // the final cumulative offset. Save it directly; do NOT call reset() or it zeroes the transform.
  onNodeDragEnded(event: CdkDragEnd, node: ArchitectureNode): void {
    const pos = event.source.getFreeDragPosition();
    this.architectureService.updateNodePosition(node.id, pos);
  }

  onMarketplaceDragEnded(event: CdkDragEnd, service: ArchitectureNode): void {
    event.source.reset();
    const dropPoint = event.dropPoint;
    const container = this.canvasContainerRef.nativeElement;
    const rect = container.getBoundingClientRect();

    if (
      dropPoint.x >= rect.left &&
      dropPoint.x <= rect.right &&
      dropPoint.y >= rect.top &&
      dropPoint.y <= rect.bottom
    ) {
      const canvasX = dropPoint.x - rect.left + container.scrollLeft;
      const canvasY = dropPoint.y - rect.top + container.scrollTop;
      this.addToCanvas(service, { x: canvasX, y: canvasY });
    }
  }

  addToCanvas(service: ArchitectureNode, position?: { x: number; y: number }): void {
    const newNode: ArchitectureNode = {
      ...service,
      id: `${service.id}-${Date.now()}`,
      position: position ?? { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
    };
    this.architectureService.addNodeToCanvas(newNode);
  }

  onExportMermaid(nodes: ArchitectureNode[]): void {
    const mermaid = this.exportService.exportAsMermaid(nodes);
    console.log(mermaid);
  }

  // Computes an SVG path string between two node edges with at most one bend.
  // Selects exit/entry sides based on dominant axis, then routes H→V or V→H.
  getEdgePath(source: ArchitectureNode, target: ArchitectureNode): string {
    const W = NODE_WIDTH, H = NODE_HEIGHT;
    const scx = source.position.x + W / 2;
    const scy = source.position.y + H / 2;
    const tcx = target.position.x + W / 2;
    const tcy = target.position.y + H / 2;
    const dx = tcx - scx;
    const dy = tcy - scy;

    let x1: number, y1: number, x2: number, y2: number;

    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx >= 0) {
        x1 = source.position.x + W; y1 = scy;
        x2 = target.position.x;     y2 = tcy;
      } else {
        x1 = source.position.x;     y1 = scy;
        x2 = target.position.x + W; y2 = tcy;
      }
      return `M ${x1},${y1} H ${x2} V ${y2}`;
    } else {
      if (dy >= 0) {
        x1 = scx; y1 = source.position.y + H;
        x2 = tcx; y2 = target.position.y;
      } else {
        x1 = scx; y1 = source.position.y;
        x2 = tcx; y2 = target.position.y + H;
      }
      return `M ${x1},${y1} V ${y2} H ${x2}`;
    }
  }

  getNodeFromList(nodes: ArchitectureNode[], id: string): ArchitectureNode | undefined {
    return nodes.find(n => n.id === id);
  }

  trackById(_index: number, node: ArchitectureNode): string {
    return node.id;
  }
}
