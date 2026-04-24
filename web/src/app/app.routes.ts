import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'squad-architecture', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'squad-management',
    loadComponent: () =>
      import('./features/squad-management/squad-management.component').then(
        m => m.SquadManagementComponent,
      ),
  },
  {
    path: 'squad-architecture',
    loadComponent: () =>
      import('./features/squad-architecture/squad-architecture.component').then(
        m => m.SquadArchitectureComponent,
      ),
  },
  {
    path: 'ecosystem-view',
    loadComponent: () =>
      import('./features/ecosystem-view/ecosystem-view.component').then(
        m => m.EcosystemViewComponent,
      ),
  },
  {
    path: 'ai-chat',
    loadComponent: () =>
      import('./features/ai-chat/ai-chat.component').then(m => m.AiChatComponent),
  },
];
