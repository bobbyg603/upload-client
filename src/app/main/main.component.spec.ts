import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { firstValueFrom, lastValueFrom, of, take } from 'rxjs';
import { FilesService } from '../common/files/files.service';
import { ModalComponent } from '../upload/modal/modal.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  let files: any;
  let filesService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        MockComponent(ModalComponent)
      ],
      imports: [
        MockModule(FontAwesomeModule)
      ], 
      providers: [
        MockProvider(FilesService)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    files = [
      '🚀.png',
      '👻.mov'
    ];
    filesService = TestBed.inject(FilesService);
    filesService.getFiles.and.returnValue(of(files));

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show table when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table').hidden).toBeFalse();
    expect(fixture.nativeElement.querySelector('.spinner-border').hidden).toBeTrue();
  });

  it('should show spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table').hidden).toBeTrue();
    expect(fixture.nativeElement.querySelector('.spinner-border').hidden).toBeFalse();
  });

  it('should set showUploadModal to true when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    component.uploadModalOpen = false;

    button.click();

    expect(component.uploadModalOpen).toEqual(true);
  });

  describe('files$', () => {
    let result: any;

    beforeEach(fakeAsync(async () => {
      component.loading = true;
      component.ngOnInit();
      const resultPromise = firstValueFrom(component.files$);
      tick(3000);
      result = await resultPromise;
    }));

    it('should call getFiles', () => {
      expect(filesService.getFiles).toHaveBeenCalledTimes(1);
    });

    it('should set loading to false when content has been loaded', () => {
      expect(component.loading).toEqual(false);
    });

    it('should emit result of call to getFiles', () => {
      expect(result).toEqual(files);
    });
  });

  describe('onUploadComplete', () => {
    it('should set loading to true', () => {
      component.loading = false;

      component.onUploadComplete();

      expect(component.loading).toEqual(true);
    });

    it('should call getFiles to get called again', fakeAsync(async () => {
      const newFiles = [...files, '🤖.txt'];
      filesService.getFiles.and.returnValues(
        of(files),
        of(newFiles)
      );
      component.ngOnInit();
      const resultPromise = lastValueFrom(component.files$.pipe(take(2)));
      
      component.onUploadComplete();
      tick(3000);
      await resultPromise;

      expect(filesService.getFiles).toHaveBeenCalledTimes(2);
    }));

    it('should cause files$ to emit a new value', fakeAsync(async () => {
      const newFiles = [...files, '🤖.txt'];
      filesService.getFiles.and.returnValues(
        of(files),
        of(newFiles)
      );
      component.ngOnInit();
      const resultPromise = lastValueFrom(component.files$.pipe(take(2)));
      
      component.onUploadComplete();
      tick(3000);
      const result = await resultPromise;

      expect(result).toEqual(newFiles);
    }));
  });
});
