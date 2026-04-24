import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegisterSquadModalComponent } from './register-squad-modal.component';

describe('RegisterSquadModalComponent', () => {
  let component: RegisterSquadModalComponent;
  let fixture: ComponentFixture<RegisterSquadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSquadModalComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterSquadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close when onClose() is called', () => {
    const spy = jest.fn();
    component.close.subscribe(spy);
    component.onClose();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('isValid should be false when form is empty', () => {
    expect(component.isValid).toBe(false);
  });

  it('isValid should be false when name is too short', () => {
    component.name = 'A';
    component.domain = 'Engineering';
    component.technicalLead = 'Dev Lead';
    component.selectedBlueprint.set('MICROSERVICE');
    expect(component.isValid).toBe(false);
  });

  it('isValid should be true when all fields are filled correctly', () => {
    component.name = 'Test Squad';
    component.domain = 'Engineering';
    component.technicalLead = 'Dev Lead';
    component.selectedBlueprint.set('MICROSERVICE');
    expect(component.isValid).toBe(true);
  });

  it('onSubmit() should emit submitted payload when form is valid', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);

    component.name = 'Test Squad';
    component.domain = 'Engineering';
    component.technicalLead = 'Dev Lead';
    component.selectedBlueprint.set('FRONTEND_APP');

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      name: 'Test Squad',
      domain: 'Engineering',
      technicalLead: 'Dev Lead',
      blueprintType: 'FRONTEND_APP',
    });
  });

  it('onSubmit() should not emit when form is invalid', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('selectBlueprint() should update selectedBlueprint signal', () => {
    component.selectBlueprint('DATA_PIPELINE');
    expect(component.selectedBlueprint()).toBe('DATA_PIPELINE');
  });
});
