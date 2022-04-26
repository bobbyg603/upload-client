import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { AlertColor } from 'src/app/alert/alert';
import { AlertService } from 'src/app/alert/alert.service';

@Component({
  selector: 'common-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent {

  @Input() accept: string = '.png,.mov'; // TODO BG allow *
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = true;
  @Input() disabledText: string = this.selectFilesDescription;

  @Output() filesDropped: EventEmitter<Array<NgxFileDropEntry>> = new EventEmitter<Array<NgxFileDropEntry>>();

  faUpload = faUpload;

  get dropZoneClassName(): string {
    return this.disabled ? 'ngx-file-drop__drop-zone--disabled' : 'ngx-file-drop__drop-zone--enabled';
  }

  get selectFilesDescription(): string {
    return this.multiple ? 'Select files' : 'Select a file';
  }

  constructor(private _alertService: AlertService) { }

  dropped(files: NgxFileDropEntry[]): void {
    if (files.find(file => file.fileEntry.isDirectory)) {
      this._alertService.pushAlert(
        'Uploading folders is not supported, please upload as a .zip file instead',
        AlertColor.Red
      );
      return;
    }

    const validFiles = files.filter(file => {
      if (!file?.fileEntry?.name) {
        return false;
      }

      // TODO BG support *
      const extension = file.fileEntry.name.split('.').pop();
      const allowed = this.accept.split(',');
      if (!allowed.find(allowedExt => allowedExt.trim().slice(1) === extension)) {
        this._alertService.pushAlert(
          `${file.fileEntry.name} is an unsupported file type`,
          AlertColor.Red
        );
        return false;
      }

      return true;
    });

    if (validFiles.length) {
      this.filesDropped.next(validFiles);
    }
  }
}
