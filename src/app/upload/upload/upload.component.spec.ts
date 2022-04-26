import { fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbProgressbar, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { FilesService } from 'src/app/common/files/files.service';
import { DragDropComponent } from '../drag-drop/drag-drop.component';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: MockedComponentFixture<UploadComponent>;

  let files: any;
  let filesService: any;
  let progressEvents: any;

  beforeEach(() => {
    return MockBuilder(UploadComponent)
      .mock(DragDropComponent)
      .mock(FontAwesomeModule)
      .mock(NgbProgressbarModule)
      .mock(FilesService);
  });

  beforeEach(() => {
    files = [
      '🚀.png',
      '👻.mov'
    ];
    progressEvents = [
      {
        name: files[0],
        done: true,
        failed: false
      },
      {
        name: files[1],
        done: true,
        failed: true
      }
    ]

    fixture = MockRender(UploadComponent);
    component = fixture.point.componentInstance;
    
    filesService = fixture.point.injector.get(FilesService);
    filesService.uploadFiles.and.returnValue(
      of(progressEvents)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('failed uploads', () => {
    let failedFile: any;

    beforeEach(() => {
      failedFile = progressEvents.find((event: any) => event.failed);
      component.uploads$ = of([failedFile]);
      fixture.detectChanges();
    });

    it('should display red text containing name of failed file', () => {
      const failedFileElements = Array.from(fixture.nativeElement.querySelectorAll('.text-danger'));
      const failedFileElement = failedFileElements.find((el: any) => el.innerText.includes(failedFile.name));

      expect(failedFileElement).toBeTruthy();
    });

    it('should display a red progress bar', () => {
      const progressBar = ngMocks.find<NgbProgressbar>('ngb-progressbar');

      expect(progressBar).toBeTruthy();
      expect(progressBar.componentInstance.type).toEqual('danger');
    });
        
    it('should display red x icon', () => {
      const icon = ngMocks.find<FaIconComponent>('fa-icon');
      const parent = icon.parent;

      expect(parent?.classes['text-danger']).toBeTruthy();
    });
  });

  describe('successful uploads', () => {
    let uploadedFile: any;

    beforeEach(() => {
      uploadedFile = progressEvents.find((event: any) => !event.failed);
      component.uploads$ = of([uploadedFile]);
      fixture.detectChanges();
    });

    it('should display a green progress bar', () => {
      const progressBar = ngMocks.find<NgbProgressbar>('ngb-progressbar');

      expect(progressBar).toBeTruthy();
      expect(progressBar.componentInstance.type).toEqual('success');
    });
        
    it('should display green check icon', () => {
      const icon = ngMocks.find<FaIconComponent>('fa-icon');
      const parent = icon.parent;

      expect(parent?.classes['text-success']).toBeTruthy();
    });
  });

  describe('onFilesDropped', () => {
    it('should call uploadFiles with files', fakeAsync(async () => {
      component.onFilesDropped(files);
      const resultPromise = firstValueFrom(component.uploads$);
      tick(1000);
      
      const result = await resultPromise;

      expect(result).toEqual(progressEvents);
    }));

    it('should emit uploadComplete event when all uploads are done', fakeAsync(async () => {
      component.onFilesDropped(files);
      const uploadsPromise =  firstValueFrom(component.uploads$)
      const emittedPromise = firstValueFrom(component.uploadComplete).then(() => true);
      tick(2000);
      
      await uploadsPromise;
      const emitted = await emittedPromise;

      expect(emitted).toEqual(true);
    }));
  });
});
