import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ArchitectureNode, NodeStatus } from '../../models/architecture-node.model';

@Component({
  selector: 'app-node-card',
  imports: [NgClass],
  templateUrl: './node-card.component.html',
  styleUrl: './node-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeCardComponent {
  @Input({ required: true }) node!: ArchitectureNode;
  @Input() isConnectionMode = false;
  @Input() isConnectionSource = false;
  @Output() removeRequested = new EventEmitter<void>();
  @Output() connectSelected = new EventEmitter<void>();

  get borderClass(): string {
    const map: Record<NodeStatus, string> = {
      active:   'border-node-service',
      proposed: 'border-node-proposed',
    };
    return map[this.node.status];
  }

  get typeLabelClass(): string {
    const map: Record<NodeStatus, string> = {
      active:   'text-node-service',
      proposed: 'text-node-proposed',
    };
    return map[this.node.status];
  }

  get statusIcon(): string {
    const map: Record<NodeStatus, string> = {
      active:   'check_circle',
      proposed: 'schedule',
    };
    return map[this.node.status];
  }

  get statusIconClass(): string {
    const map: Record<NodeStatus, string> = {
      active:   'text-node-service',
      proposed: 'text-node-proposed',
    };
    return map[this.node.status];
  }
}
