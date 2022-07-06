import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxFileDropModule } from '@bugsplat/ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavModule, NgbProgressbarModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DragDropComponent } from './upload/drag-drop/drag-drop.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AlertComponent } from './alert/alert.component';
import { ModalComponent } from './upload/modal/modal.component';
import { AlertColorClassNamePipe } from './alert/alert-color-class-name.pipe';
import { UploadComponent } from './upload/upload/upload.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DragDropComponent,
    NavbarComponent,
    MainComponent,
    AlertComponent,
    ModalComponent,
    AlertColorClassNamePipe,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgxFileDropModule,
    RouterModule.forRoot([]),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
