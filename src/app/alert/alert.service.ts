import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, Subject, timer } from 'rxjs';
import { Alert, AlertColor } from './alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private _state: Alert[] = [];
  private _alertSubject = new Subject<Alert[]>();
  private _alerts$?: Observable<Alert[]>;

  get alerts$(): Observable<Alert[]> {
    if (!this._alerts$) {
      this._alerts$ = this._alertSubject.asObservable();
    }

    return this._alerts$;
  }

  dismissAlert(id: string): void {
    this.removeAlert(id);
  }

  pushErrorAlert(error: Error | HttpErrorResponse) {
    const autoDismiss = (<HttpErrorResponse>error)?.status !== 408;
    const message = error.message || 'Unknown error';
    this.pushAlert(message, AlertColor.Red, autoDismiss);
  }

  pushAlert(message: string, color: AlertColor = AlertColor.Red, autoDismiss: boolean = true): void {
    const alert = new Alert(message, color, autoDismiss);
    
    if (autoDismiss) {
      firstValueFrom(
        timer(6000)
      ).then(() => this.removeAlert(alert.id));
    }

    this.addAlert(alert);
  }

  private addAlert(alert: Alert): void {
    this._state = this._state.concat(alert);
    this._alertSubject.next(this._state);
  }

  private removeAlert(id: string): void {
    this._state = this._state.filter(alert => alert.id !== id);
    this._alertSubject.next(this._state)
  }
}
