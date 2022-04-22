import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxFileDropModule } from '@bugsplat/ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DragDropComponent } from './upload/drag-drop/drag-drop.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AlertComponent } from './alert/alert.component';
import { ModalComponent } from './upload/modal/modal.component';
import { AlertColorClassNamePipe } from './alert/alert-color-class-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DragDropComponent,
    NavbarComponent,
    MainComponent,
    AlertComponent,
    ModalComponent,
    AlertColorClassNamePipe
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    NgbNavModule,
    NgxFileDropModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
