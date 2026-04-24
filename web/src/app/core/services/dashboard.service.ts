import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { ArchitectureService } from './architecture.service';

export interface DashboardStats {
  teams: number;
  projects: number;
  services: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiService = inject(ApiService);
  private readonly architectureService = inject(ArchitectureService);

  getStats$(): Observable<DashboardStats> {
    return combineLatest([
      this.apiService.getTeams().pipe(
        map(response => response.data.length),
        catchError(() => of(0))
      ),
      this.apiService.getProjects().pipe(
        map(response => response.data.length),
        catchError(() => of(0))
      ),
      this.architectureService.getCanvasNodes$().pipe(
        map(nodes => nodes.length)
      ),
    ]).pipe(
      map(([teamsCount, projectsCount, servicesCount]) => ({
        teams: teamsCount,
        projects: projectsCount,
        services: servicesCount,
      }))
    );
  }
}
