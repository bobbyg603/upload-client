import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @Output() uploadComplete = new EventEmitter<void>();

  @ViewChild('content') modalContent!: TemplateRef<any>;

  constructor(private _modalService: NgbModal) { }

  private handleModalResult(result: any): void {
    this.openChange.next(false);
  }
}
