import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicesApiResponse, ProjectWithRelations, CreateProjectPayload } from '../../shared/models/architecture-node.model';

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  teamId: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getServices(): Observable<ServicesApiResponse> {
    return this.http.get<ServicesApiResponse>('/api/services');
  }

  getTeams(): Observable<ApiListResponse<Team>> {
    return this.http.get<ApiListResponse<Team>>('/api/teams');
  }

  getProjects(): Observable<ApiListResponse<ProjectWithRelations>> {
    return this.http.get<ApiListResponse<ProjectWithRelations>>('/api/projects');
  }

  getProject(id: string): Observable<ApiSingleResponse<ProjectWithRelations>> {
    return this.http.get<ApiSingleResponse<ProjectWithRelations>>(`/api/projects/${id}`);
  }

  createProject(payload: CreateProjectPayload): Observable<ApiSingleResponse<Project>> {
    return this.http.post<ApiSingleResponse<Project>>('/api/projects', payload);
  }
}
