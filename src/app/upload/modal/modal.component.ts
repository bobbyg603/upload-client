import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input()
  set open(value: boolean) {
    if (!value) {
      return;
    }

    this._modalService.open(
      this.modalContent,
      {
        backdrop: 'static',
        size: 'xl'
      }
    ).result.then(result => this.handleModalResult(result));
  }

  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('content') modalContent!: TemplateRef<any>;

  uploads$: Observable<any>;

  private _uploadsSubject = new Subject<any>();
  
  constructor(private _modalService: NgbModal) {
    this.uploads$ = this._uploadsSubject.asObservable();
  }

  onFilesDropped(files: NgxFileDropEntry[]): void {
    this._uploadsSubject.next(
      files.map(file => file.relativePath)
    );
  }

  private handleModalResult(result: any): void {
    this.openChange.next(false);
  }
}
