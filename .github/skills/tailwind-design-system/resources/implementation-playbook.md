# Tailwind Design System Implementation Playbook

This file contains detailed patterns, checklists, and code samples referenced by the skill.

# Tailwind Design System

Build production-ready design systems with Tailwind CSS, including design tokens, component variants, responsive patterns, and accessibility. Always folllow the patterns and best practices outlined in this playbook to ensure consistency, maintainability, and scalability across your projects.

## When to Use This Skill

- Creating a component library with Tailwind
- Implementing design tokens and theming
- Building responsive and accessible components
- Standardizing UI patterns across a codebase
- Migrating to or extending Tailwind CSS
- Setting up dark mode and color schemes

## Core Concepts

### 1. Design Token Hierarchy

SCOOT's color token structure:

```
Brand Tokens (Montserrat font, custom breakpoints)
    ├── Primary Brand Colors
    │   ├── Yellow (scoot, 80, 60, 40)
    │   ├── Gray (80, 60, 40, 20, 10, 5)
    │   └── KF Blue (100, 80, 40, 10, 5)
    │
    ├── Semantic Tokens (purpose-driven)
    │   ├── Error (100, 20, 5)
    │   ├── Success (100, 20, 5)
    │   ├── Warning (100, 20, 5)
    │   └── Link (100, 40)
    │
    └── Component Tokens (specific uses)
        ├── Buttons (error, success, kf, link)
        ├── Form inputs (error, link)
        └── Status indicators (error, success, warning)

Spacing scale: 0.25rem to 35.25rem (custom increments)
Breakpoints: xxs (320px), xs (768px), lg (1286px)
Border radius: xs (0.5rem), s (1rem), m (1.5rem)
Font families: Montserrat (sans), PingFangSC (pingfang)
```

### 2. Component Architecture

```
Base styles → Variants → Sizes → States → Overrides
```

## Quick Start

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      pingfang: ['PingFangSC', 'sans-serif'],
    },
    extend: {
      screens: {
        xxs: '320px',
        xs: '768px',
        lg: '1286px',
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        // Brand colors
        yellow: {
          5: '#FFFEE6',
          10: '#FFFCCC',
          20: '#FFFCAA',
          40: '#FFFB7F',
          60: '#FFFA55',
          80: '#FFF82B',
          scoot: '#FFF700',
        },
        gray: {
          5: '#F2F2F2',
          10: '#E6E6E6',
          20: '#CCCCCC',
          40: '#999999',
          60: '#666666',
          80: '#333333',
        },
        // Semantic colors
        error: {
          5: '#FDF6F7',
          20: '#F9D9E0',
          100: '#E04264',
        },
        warning: {
          5: '#FEF6F1',
          20: '#F7DCCF',
          100: '#E07742',
        },
        success: {
          5: '#F7FCF5',
          20: '#E1F5E3',
          100: '#6ECE79',
        },
        link: {
          40: '#A3C5F5',
          100: '#186ADE',
        },
        orange: {
          5: '#FFFCF3',
          20: '#FEF1CD',
          100: '#F9BA06',
        },
        kf: {
          5: '#F2F5F9',
          10: '#E5EAF3',
          40: '#99ACCF',
          80: '#33599F',
          100: '#003087',
        },
      },
      spacing: {
        0.25: '0.0625rem',
        0.5: '0.125rem',
        0.625: '0.15625rem',
        0.75: '0.1875rem',
        1: '0.25rem',
        1.25: '0.3125rem',
        1.75: '0.4375rem',
        2.5: '0.625rem',
        3.25: '0.8125rem',
        3.75: '0.9375rem',
        4.5: '1.125rem',
        5: '1.25rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
        // ... additional spacing values
      },
      borderRadius: {
        xs: '0.5rem',
        s: '1rem',
        m: '1.5rem',
      },
      boxShadow: {
        default: '1px 1px 4px rgba(0, 0, 0, 0.1)',
        'profile-account-menu': '1px 1px 4px 1.2px rgba(0, 0, 0, 0.15)',
        'user-profile': '0px 0px 20px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        modal: 9999,
      },
    },
  },
  plugins: [],
};
```

```css
/* styles.scss */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Gray scale */
    --color-gray-5: #f2f2f2;
    --color-gray-10: #e6e6e6;
    --color-gray-20: #cccccc;
    --color-gray-40: #999999;
    --color-gray-60: #666666;
    --color-gray-80: #333333;

    /* Yellow brand */
    --color-yellow-scoot: #fff700;
    --color-yellow-80: #fff82b;

    /* Semantic colors */
    --color-error-100: #e04264;
    --color-success-100: #6ece79;
    --color-warning-100: #e07742;
    --color-link-100: #186ade;

    /* KF Brand */
    --color-kf-100: #003087;
    --color-kf-80: #33599f;

    /* Radius */
    --radius: 0.5rem;
  }

  body {
    @apply bg-white text-gray-80;
  }
}
```

## Patterns

### Pattern 1: Variant-Based Components

```typescript
// src/app/components/button/button.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'kf';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-yellow-80 text-gray-80 border-gray-40 hover:bg-yellow-20',
  secondary: 'bg-white text-gray-80 border-gray-60 hover:bg-gray-5',
  kf: 'bg-kf-80 text-white border-kf-5 hover:bg-kf-100 hover:border-white',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 py-2 text-sm',
  md: 'h-14 px-6 py-2 text-base',
  lg: 'h-14 px-12 py-2 text-lg',
};

const BASE_STYLES =
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClass"
      class="cursor-pointer"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() class = '';

  get buttonClass(): string {
    return cn(
      BASE_STYLES,
      BUTTON_VARIANTS[this.variant],
      BUTTON_SIZES[this.size],
      this.class,
    );
  }
}

// Usage in template
// <app-button variant="primary" size="md">Click Me</app-button>
// <app-button variant="error" size="lg">Delete</app-button>
// <app-button variant="outline">Cancel</app-button>
// <app-button variant="ghost" [disabled]="true">Disabled</app-button>
```

### Pattern 2: Compound Components with Content Projection

```typescript
// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="w-full border-b bg-yellow-scoot px-4 py-3">
      <div class="flex items-center gap-4">
        <div
          class="rounded-full bg-yellow-20 w-12 h-12 flex items-center justify-center"
        >
          <img
            src="https://cdn.flyscoot.com/prod/images/default-source/web-ibe/icons/scoot-logo.svg"
            class="h-10 md:h-14 w-auto"
            alt="Scoot logo"
          />
        </div>
        <div class="flex-1">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class HeaderComponent {}

// src/app/shared/components/card/card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@/lib/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="cardClass"><ng-content></ng-content></div>`,
})
export class CardComponent {
  @Input() class = '';
  cardClass = cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    this.class,
  );
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="headerClass"><ng-content></ng-content></div>`,
})
export class CardHeaderComponent {
  @Input() class = '';
  headerClass = cn('flex flex-col space-y-1.5 p-6', this.class);
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h3 [class]="titleClass"><ng-content></ng-content></h3>`,
})
export class CardTitleComponent {
  @Input() class = '';
  titleClass = cn(
    'text-2xl font-semibold leading-none tracking-tight',
    this.class,
  );
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p [class]="descClass"><ng-content></ng-content></p>`,
})
export class CardDescriptionComponent {
  @Input() class = '';
  descClass = cn('text-sm text-muted-foreground', this.class);
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="contentClass"><ng-content></ng-content></div>`,
})
export class CardContentComponent {
  @Input() class = '';
  contentClass = cn('p-6 pt-0', this.class);
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="footerClass"><ng-content></ng-content></div>`,
})
export class CardFooterComponent {
  @Input() class = '';
  footerClass = cn('flex items-center p-6 pt-0', this.class);
}

// Usage in template
// <app-card>
//   <app-card-header>
//     <app-card-title>Account</app-card-title>
//     <app-card-description>Manage your account settings</app-card-description>
//   </app-card-header>
//   <app-card-content>
//     <form>...</form>
//   </app-card-content>
//   <app-card-footer>
//     <app-button>Save</app-button>
//   </app-card-footer>
// </app-card>
```

### Pattern 3: Form Components with Reactive Forms

```typescript
// src/app/shared/components/input/input.component.ts
import { Component, Input as InputProperty } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { cn } from '@/lib/utils';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="relative">
      <input
        [type]="type"
        [class]="inputClass"
        [formControl]="control"
        [attr.aria-invalid]="!!error"
        [attr.aria-describedby]="error ? id + '-error' : null"
      />
      <p
        *ngIf="error"
        [id]="id + '-error'"
        class="mt-1 text-sm text-destructive"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
  `,
})
export class InputComponent {
  @InputProperty() control = new FormControl('');
  @InputProperty() type = 'text';
  @InputProperty() id = 'input';
  @InputProperty() placeholder = '';
  @InputProperty() class = '';

  get error(): string | null {
    const errors = this.control.errors;
    if (!errors) return null;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email address';
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    return 'Invalid input';
  }

  get inputClass(): string {
    return cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.error && 'border-destructive focus-visible:ring-destructive',
      this.class,
    );
  }
}

// src/app/shared/components/label/label.component.ts
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `<label [class]="labelClass"><ng-content></ng-content></label>`,
})
export class LabelComponent {
  @InputProperty() class = '';
  labelClass = cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    this.class,
  );
}

// Usage with Reactive Forms
// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    LabelComponent,
    ButtonComponent,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="space-y-2">
        <app-label for="email">Email</app-label>
        <app-input
          [control]="form.get('email')!"
          type="email"
          id="email"
          placeholder="your@email.com"
        />
      </div>
      <div class="space-y-2">
        <app-label for="password">Password</app-label>
        <app-input
          [control]="form.get('password')!"
          type="password"
          id="password"
          placeholder="••••••••"
        />
      </div>
      <app-button type="submit" variant="default" [disabled]="!form.valid">
        Sign In
      </app-button>
    </form>
  `,
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

### Pattern 4: Responsive Grid System

```typescript
// src/app/shared/components/grid/grid.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@/lib/utils';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6;
type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const GRID_COLS: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

const GRID_GAPS: Record<GridGap, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="gridClass"><ng-content></ng-content></div>`,
})
export class GridComponent {
  @Input() cols: GridCols = 3;
  @Input() gap: GridGap = 'md';
  @Input() class = '';

  get gridClass(): string {
    return cn('grid', GRID_COLS[this.cols], GRID_GAPS[this.gap], this.class);
  }
}

// src/app/shared/components/container/container.component.ts
type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const CONTAINER_SIZES: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="containerClass"><ng-content></ng-content></div>`,
})
export class ContainerComponent {
  @Input() size: ContainerSize = 'xl';
  @Input() class = '';

  get containerClass(): string {
    return cn(
      'mx-auto w-full px-4 sm:px-6 lg:px-8',
      CONTAINER_SIZES[this.size],
      this.class,
    );
  }
}

// Usage in template
// <app-container>
//   <app-grid [cols]="4" gap="lg">
//     <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
//   </app-grid>
// </app-container>
```

### Pattern 5: Animation Utilities with Angular Animations

```typescript
// src/app/shared/animations/animations.ts
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { cn } from '@/lib/utils';

// Tailwind animation classes for template-based animations
export const ANIMATIONS = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',
  zoomIn: 'animate-in zoom-in-95 duration-300',
  zoomOut: 'animate-out zoom-out-95 duration-300',
};

// Compound animations
export const COMPOUND_ANIMATIONS = {
  modalEnter: cn(ANIMATIONS.fadeIn, ANIMATIONS.zoomIn, 'duration-200'),
  modalExit: cn(ANIMATIONS.fadeOut, ANIMATIONS.zoomOut, 'duration-200'),
  dropdownEnter: cn(
    ANIMATIONS.fadeIn,
    ANIMATIONS.slideInFromTop,
    'duration-150',
  ),
  dropdownExit: cn(ANIMATIONS.fadeOut, 'slide-out-to-top', 'duration-150'),
};

// Angular animation definitions for dynamic animations
export const fadeInOut = trigger('fadeInOut', [
  state('in', style({ opacity: 1 })),
  state('out', style({ opacity: 0 })),
  transition('in => out', animate('300ms ease-out')),
  transition('out => in', animate('300ms ease-in')),
]);

export const modalAnimation = trigger('modal', [
  state('hidden', style({ opacity: 0, transform: 'scale(0.95)' })),
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  transition('hidden => visible', animate('200ms ease-out')),
  transition('visible => hidden', animate('200ms ease-in')),
]);

export const dropdownAnimation = trigger('dropdown', [
  state('collapsed', style({ opacity: 0, transform: 'translateY(-10px)' })),
  state('expanded', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('collapsed => expanded', animate('150ms ease-out')),
  transition('expanded => collapsed', animate('150ms ease-in')),
]);

// src/app/shared/components/dialog/dialog.component.ts
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  animations: [modalAnimation],
  template: `
    <div
      class="fixed inset-0 z-50 bg-black/80"
      *ngIf="isOpen"
      [@modal]="isOpen ? 'visible' : 'hidden'"
    >
      <div
        class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg sm:rounded-lg"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DialogComponent {
  @Input() isOpen = false;
}
```

### Pattern 6: Dark Mode Implementation with Angular Service

```typescript
// src/app/shared/services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Theme = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme';
  private themeSubject = new BehaviorSubject<Theme>('system');
  private resolvedThemeSubject = new BehaviorSubject<'dark' | 'light'>('light');

  public theme$: Observable<Theme> = this.themeSubject.asObservable();
  public resolvedTheme$: Observable<'dark' | 'light'> =
    this.resolvedThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
    this.watchSystemTheme();
  }

  private initializeTheme(): void {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored) {
      this.themeSubject.next(stored);
    }
    this.applyTheme(this.themeSubject.value);
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.themeSubject.value === 'system') {
        this.applyTheme('system');
      }
    });
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.storageKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved: 'dark' | 'light';

    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      resolved = theme;
    }

    root.classList.add(resolved);
    this.resolvedThemeSubject.next(resolved);
  }
}

// src/app/shared/components/theme-toggle/theme-toggle.component.ts
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button
      variant="ghost"
      size="icon"
      (click)="toggleTheme()"
      [attr.aria-label]="'Toggle theme'"
    >
      <svg
        *ngIf="(resolvedTheme$ | async) === 'light'"
        class="h-5 w-5 rotate-0 scale-100 transition-all"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m-1.636 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1m1.636-6.364l.707.707M7 12a5 5 0 1110 0 5 5 0 01-10 0z"
        />
      </svg>
      <svg
        *ngIf="(resolvedTheme$ | async) === 'dark'"
        class="absolute h-5 w-5 rotate-90 scale-100 transition-all"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>
      <span class="sr-only">Toggle theme</span>
    </app-button>
  `,
})
export class ThemeToggleComponent {
  public resolvedTheme$ = this.themeService.resolvedTheme$;

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    const current = this.themeService['themeSubject'].value;
    const newTheme: Theme =
      current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
    this.themeService.setTheme(newTheme);
  }
}
```

## Utility Functions

```typescript
// src/app/shared/utils/tailwind.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes while handling conflicting utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SCOOT Brand Color Tokens
export const SCOOT_COLORS = {
  // Primary brand colors
  yellow: {
    scoot: 'yellow-scoot',
    80: 'yellow-80',
    60: 'yellow-60',
    40: 'yellow-40',
  },
  gray: {
    80: 'gray-80',
    60: 'gray-60',
    40: 'gray-40',
    20: 'gray-20',
    10: 'gray-10',
    5: 'gray-5',
  },
  // Semantic colors
  error: {
    100: 'error-100',
    20: 'error-20',
    5: 'error-5',
  },
  success: {
    100: 'success-100',
    20: 'success-20',
    5: 'success-5',
  },
  warning: {
    100: 'warning-100',
    20: 'warning-20',
    5: 'warning-5',
  },
  link: {
    100: 'link-100',
    40: 'link-40',
  },
  // KF Brand
  kf: {
    100: 'kf-100',
    80: 'kf-80',
    40: 'kf-40',
    10: 'kf-10',
    5: 'kf-5',
  },
} as const;

// Font families
export const FONTS = {
  sans: 'font-sans', // Montserrat
  pingfang: 'font-pingfang', // PingFangSC
} as const;

// Custom spacing scale
export const SPACING = {
  // Fractional spacing
  px: 'px',
  quarter: 'space-1',
  half: 'space-2',
  // Common spacing
  sm: 'space-2.5',
  md: 'space-5',
  lg: 'space-7.5',
  xl: 'space-12.5',
} as const;

// Border radius tokens
export const BORDER_RADIUS = {
  xs: 'rounded-xs',
  s: 'rounded-s',
  m: 'rounded-m',
} as const;

// Common utility classes
export const TAILWIND_UTILITIES = {
  focusRing: cn(
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
  ),
  disabled: 'disabled:pointer-events-none disabled:opacity-50',
  transition: 'transition-colors duration-200 ease-in-out',
  truncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },
};

// Responsive breakpoints
export const BREAKPOINTS = {
  xxs: '320px',
  xs: '768px',
  lg: '1286px',
} as const;
```

## Best Practices

### Do's

- **Use CSS variables** - Enable runtime theming with Angular services
- **Create variant-based components** - Define type-safe variants as constants
- **Use semantic colors** - Use `primary` not `blue-500` in Tailwind config
- **Leverage OnPush strategy** - Use `ChangeDetectionStrategy.OnPush` for better performance
- **Implement reactive patterns** - Use RxJS Observables with `.pipe()` and async pipe
- **Add accessibility** - ARIA attributes, keyboard navigation, focus states
- **Use standalone components** - Modern Angular with `standalone: true`
- **Compose content projection** - Use `<ng-content>` for flexible component composition

### Don'ts

- **Don't use arbitrary values** - Extend Tailwind theme instead
- **Don't nest @apply** - Use component classes instead
- **Don't skip focus states** - Keyboard users need them
- **Don't hardcode colors** - Use semantic tokens via CSS variables
- **Don't forget dark mode** - Test both themes
- **Don't forget accessibility** - Always use ARIA labels and keyboard support
- **Don't use ViewChild for two-way binding** - Use reactive forms instead
- **Don't create massive components** - Keep components single-responsibility

### Angular-Specific Best Practices

- **Standalone components** - Use `standalone: true` in @Component decorator
- **Reactive Forms** - Prefer FormGroup and FormControl over template-driven forms
- **OnPush detection** - Use `ChangeDetectionStrategy.OnPush` for better performance
- **Observables** - Use RxJS operators like `map`, `filter`, `switchMap`
- **Services** - Keep business logic in services (providers or services folder)
- **Dependency Injection** - Use constructor injection with type safety
- **Type safety** - Always define types for inputs and use generics

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular CDK Theming](https://material.angular.io/guide/theming)
- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [ng-bootstrap Components](https://ng-bootstrap.github.io/)
- [Angular Material](https://material.angular.io/)
- [Tailwind CSS Animate Plugin](https://github.com/formkit/auto-animate)

```

```
