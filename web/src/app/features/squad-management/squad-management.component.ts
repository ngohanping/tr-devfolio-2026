import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { SquadService } from '../../core/services/squad.service';
import { RegisterSquadPayload, Squad } from '../../shared/models/squad.model';
import { RegisterSquadModalComponent } from './register-squad-modal/register-squad-modal.component';

@Component({
  selector: 'app-squad-management',
  imports: [AsyncPipe, RegisterSquadModalComponent],
  templateUrl: './squad-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquadManagementComponent implements OnInit, OnDestroy {
  private readonly squadService = inject(SquadService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subs = new Subscription();

  squads$!: Observable<Squad[]>;
  squadCount$!: Observable<number>;
  serviceCount$!: Observable<number>;

  showModal = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.squads$ = this.squadService.getSquads$();
    this.squadCount$ = this.squads$.pipe(map(s => s.length));
    this.serviceCount$ = this.squads$.pipe(map(s => s.reduce((acc, sq) => acc + sq.serviceCount, 0)));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openRegisterModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSquadRegistered(payload: RegisterSquadPayload): void {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const sub = this.squadService.registerSquad$(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
    this.subs.add(sub);
  }

  blueprintLabel(type: Squad['blueprintType']): string {
    const labels: Record<Squad['blueprintType'], string> = {
      MICROSERVICE: 'Microservice',
      FRONTEND_APP: 'Frontend App',
      DATA_PIPELINE: 'Data Pipeline',
    };
    return labels[type];
  }

  squadInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  trackBySquadId(_index: number, squad: Squad): string {
    return squad.id;
  }
}
