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
      this._configurations = {
        baseUrl: process?.env?.['API_BASE_URL'] || DEFAULT_BASE_URL,
      };
      this.transferState.set(CONFIG_KEY, this._configurations);
    } else if (isPlatformBrowser(this.platformId)) {
      this._configurations = this.transferState.get(CONFIG_KEY, {
        baseUrl: DEFAULT_BASE_URL,
      });
      this.transferState.remove(CONFIG_KEY);
    }
  }
}
