import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxFileDropModule } from '@bugsplat/ngx-file-drop';
import { firstValueFrom } from 'rxjs';
import { AlertService } from 'src/app/alert/alert.service';
import { DragDropComponent } from './drag-drop.component';
import { MockModule } from 'ng-mocks';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertColor } from 'src/app/alert/alert';

describe('DragDropComponent', () => {
  let component: DragDropComponent;
  let fixture: ComponentFixture<DragDropComponent>;

  let alertService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DragDropComponent,
      ],
      imports: [
        MockModule(FontAwesomeModule),
        NgxFileDropModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'pushAlert');

    fixture = TestBed.createComponent(DragDropComponent);
    component = fixture.componentInstance;
    component.accept = '.xcarchive,.sym,.pdb,.mdb,.exe,.dll';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when disabled', () => {
    beforeEach(() => {
      component.disabled = true;
    });

    it('should show singular disabledText if none provided and multiple is false', () => {
      component.multiple = false;
      component.disabledText = '';

      fixture.detectChanges();

      expect(fixture.nativeElement.innerText).toContain('Select a file or drag and drop');
    });

    it('should show plural disabledText if none provided and multiple is true', () => {
      component.multiple = true;
      component.disabledText = '';

      fixture.detectChanges();

      expect(fixture.nativeElement.innerText).toContain('Select files or drag and drop');
    });

    it('should show disabledText if provided', () => {
      const disabledText = 'This dang thing is disabled';
      component.disabledText = disabledText;

      fixture.detectChanges();

      expect(fixture.nativeElement.innerText).toContain(disabledText);
    });
  });

  describe('dropZoneClassName', () => {
    it('should return enabled class name when disabled is false', () => {
      component.disabled = false;

      expect(component.dropZoneClassName).toEqual('ngx-file-drop__drop-zone--enabled');
    });

    it('should return disabled class name when disabled is true', () => {
      component.disabled = true;

      expect(component.dropZoneClassName).toEqual('ngx-file-drop__drop-zone--disabled');
    });
  });

  describe('selectFilesDescription', () => {
    it('should return singular value if multiple is false', () => {
      component.multiple = false;

      const result = component.selectFilesDescription;

      expect(result).toContain('Select a file');
    });

    it('should return plural value if multiple is true', () => {
      component.multiple = true;

      const result = component.selectFilesDescription;

      expect(result).toContain('Select files');
    });
  });

  describe('dropped', () => {
    it('should emit files if valid', async () => {
      const files: any = [{
        fileEntry: {
          name: 'foo.exe'
        }
      },
      {
        fileEntry: {
          name: 'bin.pdb'
        }
      }];
      const resultPromise = firstValueFrom(component.filesDropped as any);

      component.dropped(files);
      const result = await resultPromise;

      expect(result).toEqual(files);
    });

    it('should call pushAlert with message if file is not valid', async () => {
      const files: any = [{
        fileEntry: {
          name: 'foo.h'
        }
      },
      {
        fileEntry: {
          name: 'bin.pdb'
        }
      }];
      const resultPromise = firstValueFrom(component.filesDropped as any);

      component.dropped(files);
      await resultPromise;

      expect(alertService.pushAlert).toHaveBeenCalledWith(
        `${files[0].fileEntry.name} is an unsupported file type`,
        AlertColor.Red
      );
    });

    it('should not emit invalid file', async () => {
      const files: any = [{
        fileEntry: {
          name: 'foo.txt'
        }
      },
      {
        fileEntry: {
          name: 'bin.pdb'
        }
      }];
      const resultPromise = firstValueFrom(component.filesDropped as any);

      component.dropped(files);
      const result = await resultPromise;

      expect(result).toEqual([files[1]]);
    });
  });
});
