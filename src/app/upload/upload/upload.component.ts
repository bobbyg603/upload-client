import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { delayWhen, interval, Observable, of, tap } from 'rxjs';
import { FilesService } from 'src/app/common/files/files.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  @Output() uploadComplete = new EventEmitter<void>();

  uploads$!: Observable<Array<any>>;

  faCheck = faCheck;
  faX = faX;

  constructor(private _filesService: FilesService) { }

  onFilesDropped(files: NgxFileDropEntry[]): void {
    this.uploads$ = this._filesService.uploadFiles(files)
      .pipe(
        delayWhen(() => !environment.production ? interval(1000) : of(undefined)), // Simulate loading
        tap((uploads) => {
          const uploading = uploads.some(upload => !upload.done);

          if (!uploading) {
            this.uploadComplete.next();
          }
        }),
      )
  }
}
