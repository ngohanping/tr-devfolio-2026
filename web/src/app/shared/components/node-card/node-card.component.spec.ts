import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeCardComponent } from './node-card.component';
import { ArchitectureNode } from '../../models/architecture-node.model';
import { By } from '@angular/platform-browser';

const makeNode = (overrides: Partial<ArchitectureNode> = {}): ArchitectureNode => ({
  id: 'test-node',
  type: 'SERVICE',
  name: 'Test Node',
  subtitle: 'v1.0 • cluster',
  status: 'active',
  position: { x: 0, y: 0 },
  ...overrides,
});

describe('NodeCardComponent', () => {
  let fixture: ComponentFixture<NodeCardComponent>;
  let component: NodeCardComponent;

  const setup = (node: ArchitectureNode) => {
    fixture = TestBed.createComponent(NodeCardComponent);
    component = fixture.componentInstance;
    component.node = node;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NodeCardComponent] });
  });

  it('renders node name', () => {
    setup(makeNode({ name: 'Auth-Gateway' }));
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Auth-Gateway');
  });

  it('renders node type badge', () => {
    setup(makeNode({ type: 'DATABASE' }));
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('DATABASE');
  });

  it('renders subtitle', () => {
    setup(makeNode({ subtitle: 'Postgres 14 • Multi-AZ' }));
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Postgres 14');
  });

  it('applies green border for active node', () => {
    setup(makeNode({ status: 'active' }));
    expect(component.borderClass).toBe('border-node-service');
  });

  it('applies orange border for proposed node', () => {
    setup(makeNode({ status: 'proposed' }));
    expect(component.borderClass).toBe('border-node-proposed');
  });

  it('renders tags', () => {
    setup(makeNode({ tags: ['REST', 'V3.0'] }));
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('REST');
    expect(el.textContent).toContain('V3.0');
  });

  it('has correct aria-label', () => {
    setup(makeNode({ name: 'Auth-Gateway', type: 'SERVICE' }));
    const article = fixture.debugElement.query(By.css('[role="article"]'));
    expect(article.attributes['aria-label']).toContain('Auth-Gateway');
    expect(article.attributes['aria-label']).toContain('SERVICE');
  });
});
