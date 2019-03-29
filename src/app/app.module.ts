import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { DataTablesModule } from 'angular-datatables';
import { Constant } from './shared/constant/constant';
import { DataSharingService } from './shared/services/data-sharing.service';
import { TokenInterceptor } from './shared/interface/token-interceptor';
import { NavigationModule } from './shared/header-navigation/navigation.module';
import { DialogModule } from 'primeng/dialog';
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TooltipModule } from 'primeng/tooltip';
import { TextMaskModule } from 'angular2-text-mask';
import { CompanyAdminStatusResolve } from './shared/Resolve/company-admin-status';
import { TimeAgoPipe } from 'time-ago-pipe';
import { SuperAdminCheckPassResolve } from './shared/Resolve/super-admin-checkpass';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};
const APP_RESOLVER = [
  CompanyAdminStatusResolve,
  SuperAdminCheckPassResolve
];

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    AppRoutingModule,
    DataTablesModule,
    ConfirmDialogModule,
    NgxSpinnerModule,
    ModalDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    TextMaskModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NavigationModule,
    NgIdleKeepaliveModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    PDFExportModule
  ],
  providers: [
    Constant,
    MessageService,
    DataSharingService,
    ...APP_RESOLVER,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
