import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DashboardStats>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getStats$();
  }
}
