import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
// shared component
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

// NGX Modules
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalDialogModule } from 'ngx-modal-dialog';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

// Prime Modules
import { ToastModule } from 'primeng/toast';

// third party modules
import { DataTablesModule } from 'angular-datatables';
import { Constant } from './shared/constant/constant';
import { DataSharingService, AdminUser } from './shared/services/data-sharing.service';
// import { GoogleMapsAPIWrapper } from '@agm/core';
import { TokenInterceptor } from './shared/interface/token-interceptor';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
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
  ],
  providers: [
    Constant,
    MessageService,
    DataSharingService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
