import { Pipe, PipeTransform } from '@angular/core';
import { Alert, AlertColor } from './alert';

@Pipe({
  name: 'alertColorClassName'
})
export class AlertColorClassNamePipe implements PipeTransform {

  transform(alert: Alert): string {
    if (alert?.color === AlertColor.Green) {
      return 'alert-success';
    }

    if (alert?.color === AlertColor.Yellow) {
      return 'alert-warning';
    }

    return 'alert-danger';
  }

}
