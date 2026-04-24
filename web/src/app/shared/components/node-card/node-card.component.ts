import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ArchitectureNode, NodeType, NodeStatus } from '../../models/architecture-node.model';

@Component({
  selector: 'app-node-card',
  imports: [NgClass],
  templateUrl: './node-card.component.html',
  styleUrl: './node-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeCardComponent {
  @Input({ required: true }) node!: ArchitectureNode;

  get borderClass(): string {
    const map: Record<NodeStatus, string> = {
      active:     'border-node-service',
      proposed:   'border-node-proposed',
      restricted: 'border-node-muted',
    };
    return map[this.node.status];
  }

  get typeLabelClass(): string {
    const map: Record<NodeStatus, string> = {
      active:     'text-node-service',
      proposed:   'text-node-proposed',
      restricted: 'text-node-muted',
    };
    return map[this.node.status];
  }

  get statusIcon(): string {
    const map: Record<NodeStatus, string> = {
      active:     'check_circle',
      proposed:   'schedule',
      restricted: 'lock',
    };
    return map[this.node.status];
  }

  get statusIconClass(): string {
    const map: Record<NodeStatus, string> = {
      active:     'text-node-service',
      proposed:   'text-node-proposed',
      restricted: 'text-node-muted',
    };
    return map[this.node.status];
  }
}
