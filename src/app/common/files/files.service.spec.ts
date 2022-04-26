import { HttpClient, HttpEventType } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, lastValueFrom, of, scan, take, throwError } from 'rxjs';
import { AlertService } from 'src/app/alert/alert.service';
import { environment } from 'src/environments/environment';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;

  let alertService: any;
  let files: any;
  let fileEntries: any[];
  let progress: any;
  let httpClient: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'pushErrorAlert');

    files = [
      new File([], '🚀.png'),
      new File([], '👻.mov')
    ];
    fileEntries = [
      {
        fileEntry: {
          file: (cb: (file: any) => any) => cb(files[0])
        }
      },
      {
        fileEntry: {
          file: (cb: (file: any) => any) => cb(files[1])
        }
      }
    ];
    progress = {
      type: HttpEventType.UploadProgress,
      loaded: 50,
      total: 100
    };
    httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get').and.returnValue(of(files));
    spyOn(httpClient, 'post').and.returnValues(
      of(progress),
      of(progress)
    );

    service = TestBed.inject(FilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFiles', () => {
    let result: any;

    beforeEach(async () => result = await firstValueFrom(service.getFiles()));

    it('should call get with correct url', () => {
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.baseUrl}/files`);
    });

    it('should return result', () => {
      expect(result).toEqual(files);
    });
  });

  describe('uploadFile', () => {
    let result: any;

    beforeEach(async () => result = await firstValueFrom(service.uploadFile(files[0])));

    it('should call post with correct url', () => {
      expect(httpClient.post).toHaveBeenCalledWith(
        `${environment.baseUrl}/upload`,
        jasmine.anything(),
        jasmine.anything()
      );
    });

    it('should call post with formData containing file', () => {
      const formData = httpClient.post.calls.mostRecent().args[1] as FormData;
      expect(formData.has('file')).toEqual(true);
    });

    it('should call post with options containing reportProgress and observe events', () => {
      expect(httpClient.post).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.anything(),
        jasmine.objectContaining({
          observe: 'events',
          reportProgress: true
        })
      );
    });

    it('should return result', () => {
      expect(result).toEqual(progress);
    });
  });

  describe('uploadFiles', () => {
    let results: any;

    beforeEach(async () => {
      results = await lastValueFrom(
        service.uploadFiles(fileEntries)
          .pipe(
            scan((acc, next) => ([...acc, next]), [] as any[]),
            take(2)
          )
      );
    });

    it('should call upload file with each file in files', () => {
      expect(httpClient.post).toHaveBeenCalledTimes(2);
    });

    it('should return array of progress events', () => {
      expect(results[0]).toEqual(
        jasmine.arrayContaining([
          {
            id: jasmine.any(String),
            name: files[0].name,
            progress: 100 * progress.loaded / progress.total,
            done: false,
            failed: false
          }
        ])
      );
      expect(results[1]).toEqual(
        jasmine.arrayContaining([
          {
            id: jasmine.any(String),
            name: files[0].name,
            progress: 100 * progress.loaded / progress.total,
            done: false,
            failed: false
          },
          {
            id: jasmine.any(String),
            name: files[1].name,
            progress: 100 * progress.loaded / progress.total,
            done: false,
            failed: false
          }
        ])
      );
    });

    describe('error', () => {
      const message = 'ahh!';
      let result: any;

      beforeEach(async () => {
        httpClient.post.and.returnValue(
          throwError(() => new Error(message))
        );
        result = await firstValueFrom(service.uploadFiles(fileEntries));
      });

      it('should call pushErrorAlert with error', () => {
        expect(alertService.pushErrorAlert).toHaveBeenCalledWith(
          jasmine.objectContaining({
            message
          })
        );
      });

      it('should return result with failed true and progress 0', () => {
        expect(result).toEqual(
          jasmine.arrayContaining([
            {
              id: jasmine.any(String),
              name: files[0].name,
              failed: true,
              progress: 0,
              done: true
            }
          ])
        );
      });
    });
  });
});
