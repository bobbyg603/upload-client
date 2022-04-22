import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';
import { Alert, AlertColor } from './alert';
import { AlertColorClassNamePipe } from './alert-color-class-name.pipe';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alert1: Alert;
  let alert2: Alert;
  let alertService: any;

  beforeEach(async () => {
    alert1 = new Alert('foo!', AlertColor.Red);
    alert2 = new Alert('bar!', AlertColor.Green);

    await TestBed.configureTestingModule({
      declarations: [
        AlertComponent,
        MockPipe(AlertColorClassNamePipe)
      ],
      providers: [AlertService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'dismissAlert');
    
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alerts', () => {
    component.alerts = [alert1, alert2];

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain(alert1.message);
    expect(compiled.textContent).toContain(alert2.message);
  });

  describe('onRemoveAlertClick', () => {
    it('should call dismissAlert with id', () => {
      const id = alert1.id;

      component.onRemoveAlertClick(id);

      expect(alertService.dismissAlert).toHaveBeenCalledWith(id);
    });
  });
});
