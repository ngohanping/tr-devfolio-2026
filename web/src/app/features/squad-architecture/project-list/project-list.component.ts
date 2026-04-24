import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendProject } from '../../../shared/models/architecture-node.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ProjectListComponent {
  @Input({ required: true }) projects: FrontendProject[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() projectSelected = new EventEmitter<FrontendProject>();
  @Output() createClicked = new EventEmitter<void>();

  trackByProjectId(_index: number, project: FrontendProject): string {
    return project.id;
  }
}
