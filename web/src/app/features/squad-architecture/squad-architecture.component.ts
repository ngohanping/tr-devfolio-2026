import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

import { ArchitectureService } from '../../core/services/architecture.service';
import { ExportService } from '../../core/services/export.service';
import { NodeCardComponent } from '../../shared/components/node-card/node-card.component';
import { ArchitectureNode } from '../../shared/models/architecture-node.model';

@Component({
  selector: 'app-squad-architecture',
  imports: [AsyncPipe, FormsModule, CdkDrag, NodeCardComponent],
  templateUrl: './squad-architecture.component.html',
  styleUrl: './squad-architecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquadArchitectureComponent implements OnInit {
  private readonly architectureService = inject(ArchitectureService);
  private readonly exportService = inject(ExportService);

  canvasNodes$!: Observable<ArchitectureNode[]>;
  marketplaceServices$!: Observable<ArchitectureNode[]>;
  marketplaceFilter = '';

  ngOnInit(): void {
    this.canvasNodes$ = this.architectureService.getCanvasNodes$();
    this.marketplaceServices$ = this.architectureService.getMarketplaceServices$();
  }

  // cdkDragFreeDragPosition owns the visual transform — getFreeDragPosition() returns
  // the final cumulative offset. Save it directly; do NOT call reset() or it zeroes the transform.
  onNodeDragEnded(event: CdkDragEnd, node: ArchitectureNode): void {
    const pos = event.source.getFreeDragPosition();
    this.architectureService.updateNodePosition(node.id, pos);
  }

  addToCanvas(service: ArchitectureNode): void {
    const newNode: ArchitectureNode = {
      ...service,
      id: `${service.id}-${Date.now()}`,
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
    };
    this.architectureService.addNodeToCanvas(newNode);
  }

  onExportMermaid(nodes: ArchitectureNode[]): void {
    const mermaid = this.exportService.exportAsMermaid(nodes);
    console.log(mermaid);
  }

  trackById(_index: number, node: ArchitectureNode): string {
    return node.id;
  }
}
