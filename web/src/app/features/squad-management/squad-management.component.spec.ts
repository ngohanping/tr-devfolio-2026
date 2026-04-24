import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SquadService } from '../../core/services/squad.service';
import { RegisterSquadPayload, Squad } from '../../shared/models/squad.model';
import { SquadManagementComponent } from './squad-management.component';

const MOCK_SQUADS: Squad[] = [
  {
    id: 'squad-1',
    name: 'Flight Core',
    domain: 'Operations',
    technicalLead: 'Alice Chen',
    blueprintType: 'MICROSERVICE',
    serviceCount: 12,
    status: 'stable',
  },
  {
    id: 'squad-2',
    name: 'Data Insights',
    domain: 'Data',
    technicalLead: 'Priya Nair',
    blueprintType: 'DATA_PIPELINE',
    serviceCount: 5,
    status: 'degraded',
  },
];

describe('SquadManagementComponent', () => {
  let component: SquadManagementComponent;
  let fixture: ComponentFixture<SquadManagementComponent>;
  let mockSquadService: jest.Mocked<Pick<SquadService, 'getSquads$' | 'registerSquad$'>>;

  beforeEach(async () => {
    mockSquadService = {
      getSquads$: jest.fn().mockReturnValue(of(MOCK_SQUADS)),
      registerSquad$: jest.fn().mockReturnValue(of(MOCK_SQUADS[0])),
    };

    await TestBed.configureTestingModule({
      imports: [SquadManagementComponent],
      providers: [{ provide: SquadService, useValue: mockSquadService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SquadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showModal should be false initially', () => {
    expect(component.showModal).toBe(false);
  });

  it('openRegisterModal() should set showModal to true', () => {
    component.openRegisterModal();
    expect(component.showModal).toBe(true);
  });

  it('closeModal() should set showModal to false', () => {
    component.showModal = true;
    component.closeModal();
    expect(component.showModal).toBe(false);
  });

  it('onSquadRegistered() should call registerSquad$ and close modal on success', () => {
    component.showModal = true;
    const payload: RegisterSquadPayload = {
      name: 'New Squad',
      domain: 'Engineering',
      technicalLead: 'Dev Lead',
      blueprintType: 'FRONTEND_APP',
    };
    component.onSquadRegistered(payload);
    expect(mockSquadService.registerSquad$).toHaveBeenCalledWith(payload);
    expect(component.showModal).toBe(false);
    expect(component.isSubmitting).toBe(false);
  });

  it('onSquadRegistered() should reset isSubmitting on error', () => {
    mockSquadService.registerSquad$.mockReturnValue(throwError(() => new Error('API error')));
    component.showModal = true;
    component.onSquadRegistered({
      name: 'Fail Squad',
      domain: 'Platform',
      technicalLead: 'Lead',
      blueprintType: 'MICROSERVICE',
    });
    expect(component.isSubmitting).toBe(false);
    expect(component.showModal).toBe(true);
  });

  it('squadInitials() should return first two word initials uppercased', () => {
    expect(component.squadInitials('Flight Core')).toBe('FC');
    expect(component.squadInitials('Data Insights Team')).toBe('DI');
    expect(component.squadInitials('Alpha')).toBe('A');
  });

  it('blueprintLabel() should return human-readable label', () => {
    expect(component.blueprintLabel('MICROSERVICE')).toBe('Microservice');
    expect(component.blueprintLabel('FRONTEND_APP')).toBe('Frontend App');
    expect(component.blueprintLabel('DATA_PIPELINE')).toBe('Data Pipeline');
  });
});
