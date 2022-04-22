import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockModule } from 'ng-mocks';
import { ModalComponent } from '../upload/modal/modal.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        MockComponent(ModalComponent)
      ],
      imports: [
        MockModule(FontAwesomeModule)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showUploadModal to true when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    component.uploadModalOpen = false;

    button.click();

    expect(component.uploadModalOpen).toEqual(true);
  });
});
