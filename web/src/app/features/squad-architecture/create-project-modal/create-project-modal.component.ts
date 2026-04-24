import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectPayload } from '../../../shared/models/architecture-node.model';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateProjectModalComponent {
  @Input() submitting = false;

  @Output() submitted = new EventEmitter<CreateProjectPayload>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitted.emit({
      name: this.form.controls.name.value,
      description: this.form.controls.description.value || undefined,
    });
  }

  onBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.cancelled.emit();
    }
  }
}
