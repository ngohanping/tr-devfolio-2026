#!/bin/bash
# project-scaffolding.sh
# Script to scaffold a modern Angular web application with Tailwind, Jest, SSR, and API integration

set -e

# Step 1: Install Angular CLI if not present
if ! command -v ng &> /dev/null; then
  echo "Installing Angular CLI..."
  npm install -g @angular/cli
else
  echo "Angular CLI already installed."
fi

# Step 2: Create Angular project
if [ ! -d "web" ]; then
  echo "Creating Angular project..."
  ng new web --routing --style=scss --ssr
else
  echo "Angular project 'web' already exists."
fi

cd web

# Step 3: Add Tailwind CSS
npm install -D tailwindcss@^3 postcss autoprefixer
cat > tailwind.config.js <<EOL
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: { extend: {} },
  plugins: [],
};
EOL
cat > postcss.config.js <<EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOL
echo -e "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > src/styles.scss

# Step 4: Add Jest for testing
npm install --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom
cat > jest.config.js <<EOL
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  testMatch: ['**/*.spec.ts'],
};
EOL
cat > setup-jest.ts <<EOL
import 'jest-preset-angular/setup-env/zoneless';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
EOL

# Update package.json test script
jq '.scripts.test = "jest --no-cache"' package.json > package.tmp.json && mv package.tmp.json package.json

# Step 5: Add .env file
cat > .env <<EOL
API_BASE_URL=http://localhost:3001
EOL

# Step 6: Generate configuration service and API interceptor
ng generate service configurations/configuration

cat > src/app/configurations/configuration.service.ts <<EOL
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
  import {
    Inject,
    Injectable,
    PLATFORM_ID,
    makeStateKey,
    TransferState,
  } from '@angular/core';

  const CONFIG_KEY = makeStateKey<Configurations>('app.config');
  const DEFAULT_BASE_URL = 'http://localhost:3001';

  export interface Configurations {
    baseUrl: string;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class ConfigurationService {
    private _configurations: Configurations | null = null;

    constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private transferState: TransferState,
    ) {}

    get configurations(): Configurations {
      if (!this._configurations) {
        throw new Error('ConfigurationService not initialized');
      }
      return this._configurations;
    }

    async initializeConfiguration(): Promise<void> {
      if (this._configurations) {
        return;
      }

      if (isPlatformServer(this.platformId)) {
        // Server: Load from environment and transfer to browser
        this._configurations = {
          baseUrl: process?.env?.['API_BASE_URL'] || DEFAULT_BASE_URL,
        };
        this.transferState.set(CONFIG_KEY, this._configurations);
      } else if (isPlatformBrowser(this.platformId)) {
        // Browser: Get from TransferState or use default
        this._configurations = this.transferState.get(CONFIG_KEY, {
          baseUrl: DEFAULT_BASE_URL,
        });
        this.transferState.remove(CONFIG_KEY);
      }
    }
  }
EOL

ng generate interceptor api
cat > src/app/api.interceptor.ts <<EOL
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { ConfigurationService } from './configurations/configuration.service';
  import { catchError, throwError } from 'rxjs';

  export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    const configurationService = inject(ConfigurationService);
    const newRequest = request.clone({
      url: `${configurationService.configurations.baseUrl}${request.url}`,
    });

    return next(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  };
EOL

# Step 7: Update app configuration and app html
cat > src/app/app.config.ts <<EOL
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    APP_INITIALIZER,
  } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import {
    provideHttpClient,
    withInterceptors,
    withFetch,
  } from '@angular/common/http';

  import { routes } from './app.routes';
  import {
    provideClientHydration,
    withEventReplay,
  } from '@angular/platform-browser';
  import { apiInterceptor } from './api-interceptor';
  import { ConfigurationService } from './configurations/configuration';

  function initializeApp(configService: ConfigurationService) {
    return () => configService.initializeConfiguration();
  }

  export const appConfig: ApplicationConfig = {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes),
      provideClientHydration(withEventReplay()),
      provideHttpClient(withInterceptors([apiInterceptor]), withFetch()),
      {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigurationService],
        multi: true,
      },
    ],
  };
EOL

cat > src/app/app.html <<EOL
<div>Hello World</div>
EOL

# Step 8: Test the application
npm run test
