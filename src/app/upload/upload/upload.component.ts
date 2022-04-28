import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { delayWhen, finalize, interval, Observable, of, tap } from 'rxjs';
import { FilesService } from 'src/app/common/files/files.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  @Output() uploadComplete = new EventEmitter<void>();
  @Output() uploadStart = new EventEmitter<void>();

  uploads$!: Observable<Array<any>>;

  faCheck = faCheck;
  faX = faX;

  constructor(private _filesService: FilesService) { }

  onFilesDropped(files: NgxFileDropEntry[]): void {
    this.uploadStart.next(); // TODO BG test
    this.uploads$ = this._filesService.uploadFiles(files)
      .pipe(
        delayWhen(() => !environment.production ? interval(1000) : of(undefined)), // Simulate loading
        finalize(() => this.uploadComplete.next()),
      )
  }
}
