import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CalendarModule, CalendarDateFormatter, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { AppsRoutes } from './apps.routing';
import { EmailComponent } from './email/email.component';
import { TaskboardComponent } from './taskboard/taskboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    QuillModule,
    DragulaModule,
    RouterModule.forChild(AppsRoutes)
  ],
  declarations: [
    EmailComponent,
    TaskboardComponent,
  ]
})

export class AppsModule { }