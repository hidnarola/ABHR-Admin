import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Module
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { EditorModule } from 'primeng/editor';
import { CheckboxModule } from 'primeng/checkbox';

import { AdminComponent } from './admin.component';
// Child components
import { AgentsComponent } from './agents/agents.component';
import { StaffComponent } from './staff/staff.component';
import { CarRentalCompaniesComponent } from './car-rental-companies/car-rental-companies.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { UsersComponent } from './users/users.component';
import { OperationsComponent } from './operations/operations.component';
import { SettingsComponent } from './settings/settings.component';
import { AgentDetailComponent } from './agents/agent-detail/agent-detail.component';
import { CompanyDetailsComponent } from './car-rental-companies/company-details/company-details.component';
import { StaffDetailComponent } from './staff/staff-detail/staff-detail.component';
import { CarDetailsComponent } from './car-rental-companies/company-details/car-details/car-details.component';
import { AddEditCarComponent } from '../admin/car-rental-companies/company-details/add-edit-car/add-edit-car.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { CouponsComponent } from './coupons/coupons.component';
import { DeliveredCarsComponent } from './operations/delivered-cars/delivered-cars.component';
import { TakenAwayCarsComponent } from './operations/taken-away-cars/taken-away-cars.component';
import { RentalHistoryComponent } from './users/rental-history/rental-history.component';
import { AdminCarReportComponent } from './admin-reports/admin-car-report/admin-car-report.component';
import { AdminUsersReportComponent } from './admin-reports/admin-users-report/admin-users-report.component';
import { AdminAccountSettingComponent } from './admin-account-setting/admin-account-setting.component';
import { KeywordsComponent } from './keywords/keywords.component';
// shared component
import { RentalsComponent } from '../../shared/components/rentals-for-car/rentals.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AdminTermsComponent } from './admin-terms/admin-terms.component';
import { QuillModule } from 'ngx-quill';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CalendarModule } from 'primeng/calendar';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
import { TransactionReportComponent } from './admin-reports/transaction-report/transaction-report.component';
import { DropdownModule } from 'primeng/dropdown';
import { TakenAwayTrackingComponent } from './operations/taken-away-cars/taken-away-tracking/taken-away-tracking.component';
import { DeliveredTrackingComponent } from './operations/delivered-cars/delivered-tracking/delivered-tracking.component';

const AdminRoutes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard'
    },
    children: [
      {
        path: 'dashboard',
        component: AdminComponent,
        data: {
          title: 'Dashboard',
          urls: [{ title: 'Dashboard', url: '/admin' }]
        },
      },
      {
        path: 'agents',
        component: AgentsComponent,
        data: {
          title: 'Manage Agents',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Agents' }]
        },
      },
      {
        path: 'agents/view/:id',
        component: AgentDetailComponent,
        data: {
          title: 'View Agent Detail',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Agents', url: '/admin/agents' }, { title: 'Agent Detail' }]
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          title: 'Manage Staffs',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Staff' }]
        },
      },
      {
        path: 'staff/view/:id',
        component: StaffDetailComponent,
        data: {
          title: 'View Staff',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Staff', url: '/admin/staff' }, { title: 'Staff Detail' }]
        },
      },
      {
        path: '',
        data: {
          title: ''
        },
        children: [
          {
            path: 'car-rental-companies',
            component: CarRentalCompaniesComponent,
            data: {
              title: 'Manage Companies',
              urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Companies' }]
            },
          },
          {
            path: 'car-rental-companies/view/:id',
            component: CompanyDetailsComponent,
            data: {
              title: 'View Company Detail',
              urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
                title: 'Companies',
                url: '/admin/car-rental-companies'
              }, { title: 'Company Detail' }]
            },
          },
          {
            path: 'car-rental-companies/car/view/:id',
            component: CarDetailsComponent,
            data: {
              title: 'View Car',
              urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
                title: 'Companies',
                url: '/admin/car-rental-companies'
              }, {
                title: 'Company Detail',
                url: '/admin/car-rental-companies/view/:id'
              }, { title: 'Car Detail' }]
            },
          },
          {
            path: 'car-rental-companies/car/edit/:id',
            component: AddEditCarComponent,
            data: {
              title: 'Edit Car',
              urls: [{ title: 'Dashboard', url: '/admin/dashboard' },
              {
                title: 'Companies',
                url: '/admin/car-rental-companies'
              }, {
                title: 'Company Detail',
                url: '/admin/car-rental-companies/view/:_id'
              },
              { title: 'Car Detail' }]
            },
          },
          {
            path: 'car-rental-companies/car/add',
            component: AddEditCarComponent,
            data: {
              title: 'Add Car',
              urls: [{ title: 'Admin Dashboard', url: '/admin/dashboard' },
              {
                title:
                  'Companies', url: '/admin/car-rental-companies'
              },
              {
                title: 'Company Detail',
                url: '/admin/car-rental-companies/view/:_id'
              },
              { title: 'Add Car' }]
            },
          },
        ]
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Manage Users',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Users' }]
        },
      },
      {
        path: 'users/view/:id',
        component: UserDetailsComponent,
        data: {
          title: 'View User Detail',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Users', url: '/admin/users' }, { title: 'User Detail' }]
        },
      },
      {
        path: 'users/history/:id',
        component: RentalHistoryComponent,
        data: {
          title: 'View Rental History',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Users', url: '/admin/users' }, { title: 'Rental History' }]
        },
      },
      {
        path: 'transactions',
        component: TransactionComponent,
        data: {
          title: 'Manage Transactions',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Transactions' }]
        },
      },
      {
        path: 'transactions/view/:id',
        component: TransactionDetailComponent,
        data: {
          title: 'View Transactions',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Transactions',
            url: '/admin/transactions'
          }, { title: 'Transactions Detail' }]
        },
      },
      {
        path: 'reports',
        component: AdminReportsComponent,
        data: {
          title: 'Manage Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Reports' }]
        },
      },
      {
        path: 'reports/car-reports',
        component: AdminCarReportComponent,
        data: {
          title: 'Manage Car Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Car Reports' }]
        },
      },
      {
        path: 'reports/user-reports',
        component: AdminUsersReportComponent,
        data: {
          title: 'Manage User Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'User Reports' }]
        },
      },
      {
        path: 'reports/transaction-reports',
        component: TransactionReportComponent,
        data: {
          title: 'Transaction Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Transaction Reports' }]
        },
      },
      {
        path: 'operations',
        component: OperationsComponent,
        data: {
          title: 'Operations',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Operations' }]
        },
      },
      {
        path: 'operations/car-delivered',
        component: DeliveredCarsComponent,
        data: {
          title: 'Manage Delivered  Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Delivered Cars' }]
        },
      },
      {
        path: 'operations/car-delivered/view/:id',
        component: DeliveredTrackingComponent,
        data: {
          title: 'Track Delivered Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Delivered Cars',
            url: '/admin/operations/car-delivered'
          }, { title: 'Track Delivered Cars' }]
        },
      },
      {
        path: 'operations/car-taken-away',
        component: TakenAwayCarsComponent,
        data: {
          title: 'Manage Taken Away Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Taken Away Cars' }]
        },
      },
      {
        path: 'operations/car-taken-away/view/:id',
        component: TakenAwayTrackingComponent,
        data: {
          title: 'Track Taken Away Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Taken Away Cars',
            url: '/admin/operations/car-taken-away'
          }, { title: 'Track Taken Away Cars' }]
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Settings',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Settings' }]
        },
      },
      {
        path: 'account-setting',
        component: AdminAccountSettingComponent,
        data: {
          title: 'Account Setting',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Account Settings' }]
        }
      },
      {
        path: 'legal_settings',
        component: AdminTermsComponent,
        data: {
          title: 'Legal Settings',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Legal Settings' }]
        }
      }
    ]
  },
  {
    path: 'keywords',
    component: KeywordsComponent,
    data: {
      title: 'Manage Keywords',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Keywords' }]
    },
  },
  {
    path: 'coupons',
    component: CouponsComponent,
    data: {
      title: 'Manage Coupons',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Coupons' }]
    },
  },
];

const config: SocketIoConfig = { url: 'http://18.219.16.50:3000', options: {} };

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    RouterModule.forChild(AdminRoutes),
    NgxDatatableModule,
    Ng2SmartTableModule,
    DataTablesModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    InputSwitchModule,
    TooltipModule,
    MenuModule,
    QuillModule,
    EditorModule,
    CheckboxModule,
    Ng4GeoautocompleteModule.forRoot(),
    SocketIoModule.forRoot(config),
    CalendarModule,
    DropdownModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory
    // }),
  ],
  exports: [RouterModule],
  declarations: [
    AgentsComponent,
    StaffComponent,
    CarRentalCompaniesComponent,
    AdminComponent,
    AdminReportsComponent,
    UsersComponent,
    OperationsComponent,
    SettingsComponent,
    AgentDetailComponent,
    StaffDetailComponent,
    CompanyDetailsComponent,
    RentalsComponent,
    AlertComponent,
    CarDetailsComponent,
    AddEditCarComponent,
    UserDetailsComponent,
    RentalHistoryComponent,
    AdminCarReportComponent,
    AdminUsersReportComponent,
    AdminAccountSettingComponent,
    KeywordsComponent,
    AdminTermsComponent,
    CouponsComponent,
    DeliveredCarsComponent,
    TakenAwayCarsComponent,
    TransactionComponent,
    TransactionDetailComponent,
    TransactionReportComponent,
    TakenAwayTrackingComponent,
    DeliveredTrackingComponent,
  ],
  providers: [
    // DataSharingService,
  ]
})
export class AdminModule { }
