import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Alert } from "./alert";
import { AlertService } from './alert.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input() alerts: Alert[] = [];
  @Output() removeAlertRequested: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _alertService: AlertService) { }

  onRemoveAlertClick(id: string): void {
    this._alertService.dismissAlert(id);
  }
}
