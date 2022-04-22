import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AlertService } from './alert/alert.service';
import { Alert } from "./alert/alert";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  alerts$: Observable<Alert[]>;

  constructor(alertService: AlertService, titleService: Title) {
    titleService.setTitle('Upload | @bobbyg603');
    this.alerts$ = alertService.alerts$;
  }
}
