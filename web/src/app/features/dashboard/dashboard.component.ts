import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { EcosystemApiService } from '../../core/services/ecosystem-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly ecosystemApiService = inject(EcosystemApiService);

  readonly isLoading$ = this.ecosystemApiService.isLoading$();
  readonly error$ = this.ecosystemApiService.getError$();

  readonly teamCount$ = this.ecosystemApiService.getEcosystem$().pipe(
    map(graph => graph?.nodes.filter(n => n.nodeType === 'TEAM').length ?? 0)
  );

  readonly projectCount$ = this.ecosystemApiService.getEcosystem$().pipe(
    map(graph => graph?.nodes.filter(n => n.nodeType === 'PROJECT').length ?? 0)
  );

  readonly serviceCount$ = this.ecosystemApiService.getEcosystem$().pipe(
    map(graph => graph?.nodes.filter(n => n.nodeType === 'SERVICE').length ?? 0)
  );

  readonly connectionCount$ = this.ecosystemApiService.getEcosystem$().pipe(
    map(graph => graph?.edges.length ?? 0)
  );

  ngOnInit(): void {
    this.ecosystemApiService.fetchEcosystem();
  }
}
