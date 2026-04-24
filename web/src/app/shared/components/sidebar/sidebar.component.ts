import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard',          icon: 'dashboard',        route: '/dashboard' },
    { label: 'Squad Management',   icon: 'group',            route: '/squad-management' },
    { label: 'Squad Architecture', icon: 'account_tree',     route: '/squad-architecture' },
    { label: 'Ecosystem View',     icon: 'language',         route: '/ecosystem-view' },
    { label: 'AI Chat',            icon: 'smart_toy',        route: '/ai-chat' },
  ];
}
