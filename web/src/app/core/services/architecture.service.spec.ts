import { TestBed } from '@angular/core/testing';
import { ArchitectureService } from './architecture.service';
import { firstValueFrom } from 'rxjs';

describe('ArchitectureService', () => {
  let service: ArchitectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchitectureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCanvasNodes$ returns mock nodes', async () => {
    const nodes = await firstValueFrom(service.getCanvasNodes$());
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes[0]).toHaveProperty('id');
    expect(nodes[0]).toHaveProperty('type');
    expect(nodes[0]).toHaveProperty('position');
  });

  it('getMarketplaceServices$ returns marketplace entries', async () => {
    const services = await firstValueFrom(service.getMarketplaceServices$());
    expect(services.length).toBeGreaterThan(0);
  });

  it('updateNodePosition updates the node position', async () => {
    const initial = await firstValueFrom(service.getCanvasNodes$());
    const target = initial[0];
    const newPos = { x: 999, y: 888 };

    service.updateNodePosition(target.id, newPos);

    const updated = await firstValueFrom(service.getCanvasNodes$());
    const changedNode = updated.find(n => n.id === target.id);
    expect(changedNode?.position).toEqual(newPos);
  });

  it('addNodeToCanvas appends a new node', async () => {
    const initial = await firstValueFrom(service.getCanvasNodes$());
    const newNode = {
      id: 'test-node',
      type: 'SERVICE' as const,
      name: 'Test Node',
      subtitle: 'testing',
      status: 'active' as const,
      position: { x: 0, y: 0 },
    };

    service.addNodeToCanvas(newNode);

    const after = await firstValueFrom(service.getCanvasNodes$());
    expect(after.length).toBe(initial.length + 1);
    expect(after.find(n => n.id === 'test-node')).toBeDefined();
  });
});
