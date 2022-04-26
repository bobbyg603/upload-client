import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpUploadProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { bindCallback, catchError, filter, from, map, mergeMap, Observable, of, scan, switchMap } from 'rxjs';
import { AlertService } from 'src/app/alert/alert.service';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from 'uuid';
import { FileUploadProgress } from './file-upload-progress';
import { UploadedFile } from './uploaded-file';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private _alertService: AlertService,
    private _httpClient: HttpClient,
  ) { }

  getFiles(): Observable<UploadedFile[]> {
    return this._httpClient.get<UploadedFile[]>(`${environment.baseUrl}/files`);
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const url = `${environment.baseUrl}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this._httpClient.post(
      url,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  uploadFiles(files: NgxFileDropEntry[]): Observable<FileUploadProgress[]> {
    return from(files)
      .pipe(
        mergeMap(selectedFile => {
          // Drag and drop will call webkitGetAsEntry in @bugsplat/ngx-file-drop.
          // WebkitGetAsEntry returns an object with the file method inherited from the prototype.
          // This means fileSystemFileEntry.file needs to be called with the correct object context.
          // See https://rxjs-dev.firebaseapp.com/api/index/function/bindCallback#use-bindcallback-on-an-object-method
          const id = uuid();
          const fileEntry = selectedFile.fileEntry as FileSystemFileEntry;
          const observableFactory = createObservableFactoryFromFuncWithCallback(fileEntry.file);
          const file$ = <Observable<File>>observableFactory.call(fileEntry);
          return file$
            .pipe(
              switchMap(file => {
                return this.uploadFile(file)
                  .pipe(
                    filter(isHttpProgressEvent),
                    map((event) => {
                      const name = file.name;
                      const loaded = event.loaded ?? 0;
                      const total = event.total ?? 1;
                      const progress = Math.round(loaded / total * 100);
                      const failed = false;
                      const done = progress === 100;
                      return {
                        id,
                        name,
                        progress,
                        failed,
                        done
                      };
                    }),
                    catchError((error) => {
                      this._alertService.pushErrorAlert(error);
                      const name = file.name;
                      const progress = 0;
                      const failed = true;
                      const done = true;
                      return of({
                        id,
                        name,
                        progress,
                        failed,
                        done
                      });
                    })
                  );
              })
            );
        }),
        scan((acc, next) => {
          const id = next.id;
          const name = next.name;
          const progress = !next.progress && acc[id]?.progress ? acc[id].progress : next.progress;
          const failed = next.failed;
          const done = next.done;
          acc[id] = {
            id,
            name,
            progress,
            failed,
            done
          };
          return {
            ...acc
          };
        }, {} as Record<string, FileUploadProgress>),
        map(uploads => Object.values(uploads)),
      );
  }
}

function isHttpProgressEvent(input: HttpEvent<any>): input is HttpUploadProgressEvent {
  return input.type === HttpEventType.UploadProgress;
}

function createObservableFactoryFromFuncWithCallback<R1>(
  callbackFunc: (callback: (res1: R1) => any) => any,
  scheduler?: any
): () => Observable<R1> {
  return bindCallback(callbackFunc);
}