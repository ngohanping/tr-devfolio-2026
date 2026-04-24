import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RegisterSquadPayload } from '../../shared/models/squad.model';
import { SquadService } from './squad.service';

const MOCK_API_TEAMS = [
  { id: '1', name: 'Platform Team', lead: 'Alice Chen', description: 'Operations', projects: [{}] },
  { id: '2', name: 'Data Team', lead: 'Priya Nair', description: 'Data', projects: [] },
];

describe('SquadService', () => {
  let service: SquadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SquadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSquads$() should GET /api/teams and map to Squad[]', async () => {
    const result$ = firstValueFrom(service.getSquads$());
    httpMock.expectOne('/api/teams').flush({ data: MOCK_API_TEAMS });

    const squads = await result$;
    expect(squads.length).toBe(2);
    expect(squads[0].name).toBe('Platform Team');
    expect(squads[0].technicalLead).toBe('Alice Chen');
    expect(squads[0].domain).toBe('Operations');
    expect(squads[0].serviceCount).toBe(1);
    expect(squads[0].status).toBe('stable');
    expect(squads[1].status).toBe('proposed');
  });

  it('getSquads$() should default missing lead to "Unassigned"', async () => {
    const result$ = firstValueFrom(service.getSquads$());
    httpMock.expectOne('/api/teams').flush({ data: [{ id: '3', name: 'New Team' }] });

    const squads = await result$;
    expect(squads[0].technicalLead).toBe('Unassigned');
    expect(squads[0].domain).toBe('Operations');
  });

  it('registerSquad$() should POST to /api/teams with mapped body and trigger refresh', async () => {
    const payload: RegisterSquadPayload = {
      name: 'Test Squad',
      domain: 'Engineering',
      technicalLead: 'Dev Lead',
      blueprintType: 'FRONTEND_APP',
    };

    const result$ = firstValueFrom(service.registerSquad$(payload));

    const postReq = httpMock.expectOne('/api/teams');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({
      name: 'Test Squad',
      lead: 'Dev Lead',
      members: [],
      description: 'Engineering',
    });
    postReq.flush({ data: { id: 'new-1', name: 'Test Squad', lead: 'Dev Lead', description: 'Engineering', projects: [] } });

    const squad = await result$;
    expect(squad.name).toBe('Test Squad');
    expect(squad.domain).toBe('Engineering');
    expect(squad.blueprintType).toBe('FRONTEND_APP');
    expect(squad.status).toBe('proposed');
    expect(squad.serviceCount).toBe(0);
  });
});
