import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlueprintType, EcosystemDomain, RegisterSquadPayload } from '../../../shared/models/squad.model';

interface BlueprintOption {
  value: BlueprintType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-register-squad-modal',
  imports: [FormsModule],
  templateUrl: './register-squad-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSquadModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<RegisterSquadPayload>();

  readonly domains: EcosystemDomain[] = ['Operations', 'Engineering', 'Data', 'Platform', 'Security'];

  readonly blueprints: BlueprintOption[] = [
    { value: 'MICROSERVICE', label: 'Microservice', icon: 'memory' },
    { value: 'FRONTEND_APP', label: 'Frontend App', icon: 'web' },
    { value: 'DATA_PIPELINE', label: 'Data Pipeline', icon: 'storage' },
  ];

  name = '';
  domain: EcosystemDomain | '' = '';
  technicalLead = '';
  selectedBlueprint = signal<BlueprintType | null>(null);

  get isValid(): boolean {
    return (
      this.name.trim().length >= 2 &&
      this.domain !== '' &&
      this.technicalLead.trim().length > 0 &&
      this.selectedBlueprint() !== null
    );
  }

  selectBlueprint(value: BlueprintType): void {
    this.selectedBlueprint.set(value);
  }

  onSubmit(): void {
    if (!this.isValid) return;
    this.submitted.emit({
      name: this.name.trim(),
      domain: this.domain as EcosystemDomain,
      technicalLead: this.technicalLead.trim(),
      blueprintType: this.selectedBlueprint()!,
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
