import { Component, OnInit } from '@angular/core';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, delayWhen, interval, Observable, of, share, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilesService } from '../common/files/files.service';
import { UploadedFile } from '../common/files/uploaded-file';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  faFilePlus = faFileCirclePlus;
  loading = true;
  uploadModalOpen = false;

  files$!: Observable<UploadedFile[]>;

  private _refreshSubject = new BehaviorSubject<any>(null);

  constructor(private _filesService: FilesService) { }

  ngOnInit(): void {
    this.files$ = this._refreshSubject
      .pipe(
        delayWhen(() => !environment.production ? interval(3000) : of(undefined)), // Simulate loading
        switchMap(() => this._filesService.getFiles()),
        tap(() => this.loading = false),
        share()
      );
  }

  onUploadComplete(): void {
    this.loading = true;
    this._refreshSubject.next(null);
  }
}
