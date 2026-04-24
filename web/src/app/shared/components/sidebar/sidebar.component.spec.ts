import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders all 5 nav items', () => {
    expect(component.navItems.length).toBe(5);
  });

  it('nav items include Squad Architecture route', () => {
    const routes = component.navItems.map(i => i.route);
    expect(routes).toContain('/squad-architecture');
  });

  it('renders nav labels in the template', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Dashboard');
    expect(el.textContent).toContain('Squad Architecture');
    expect(el.textContent).toContain('Ecosystem View');
    expect(el.textContent).toContain('AI Chat');
  });

  it('renders Architecture Hub logo text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Architecture Hub');
  });
});
