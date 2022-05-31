import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MockComponent } from 'ng-mocks';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AlertComponent } from './alert/alert.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(NavbarComponent),
        MockComponent(MainComponent),
        MockComponent(AlertComponent)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title 'Upload | @bobbyg603'`, () => {
    expect(TestBed.inject(Title).getTitle()).toEqual('Upload | @bobbyg603');
  });
});
