import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';
import { ArchitectureNode } from '../../shared/models/architecture-node.model';

const MOCK_NODES: ArchitectureNode[] = [
  {
    id: 'auth-gateway',
    type: 'SERVICE',
    name: 'Auth-Gateway',
    subtitle: 'v2.4.1',
    status: 'active',
    position: { x: 0, y: 0 },
  },
  {
    id: 'user-db',
    type: 'DATABASE',
    name: 'User-DB',
    subtitle: 'Postgres 14',
    status: 'active',
    position: { x: 100, y: 100 },
  },
];

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportAsMermaid returns a non-empty string', () => {
    const result = service.exportAsMermaid(MOCK_NODES);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('exportAsMermaid starts with "graph TD"', () => {
    const result = service.exportAsMermaid(MOCK_NODES);
    expect(result.startsWith('graph TD')).toBe(true);
  });

  it('exportAsMermaid includes node ids', () => {
    const result = service.exportAsMermaid(MOCK_NODES);
    expect(result).toContain('auth-gateway');
    expect(result).toContain('user-db');
  });
});
