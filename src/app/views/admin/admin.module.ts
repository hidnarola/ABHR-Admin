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
import { UiSwitchModule } from 'ngx-ui-switch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { EditorModule } from 'primeng/editor';
import { CheckboxModule } from 'primeng/checkbox';
import { AdminComponent } from './admin.component';
import { AgentsComponent } from './agents/agents.component';
import { StaffComponent } from './staff/staff.component';
import { CarRentalCompaniesComponent } from './car-rental-companies/car-rental-companies.component';
import { UsersComponent } from './users/users.component';
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
import { RentalsComponent } from '../../shared/components/rentals-for-car/rentals.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AdminTermsComponent } from './admin-terms/admin-terms.component';
import { QuillModule } from 'ngx-quill';
import { CalendarModule } from 'primeng/calendar';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
import { TransactionReportComponent } from './admin-reports/transaction-report/transaction-report.component';
import { DropdownModule } from 'primeng/dropdown';
import { TakenAwayTrackingComponent } from './operations/taken-away-cars/returning-tracking/taken-away-tracking.component';
import { DeliveredTrackingComponent } from './operations/delivered-cars/delivered-tracking/delivered-tracking.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { environment } from '../../../environments/environment';
import { ArticleListComponent } from './help/article-list/article-list.component';
import { AddEditArticleComponent } from './help/article-list/add-edit-article/add-edit-article.component';
import { ArticleDetailComponent } from './help/article-list/article-detail/article-detail.component';
import { DeliveringTrackingComponent } from './operations/delivered-cars/delivering-tracking/delivering-tracking.component';
import { ReturnedTrackingComponent } from './operations/taken-away-cars/returned-tracking/returned-tracking.component';
import { AdminInvoiceComponent } from './transaction/admin-invoice/admin-invoice.component';
import { FeedbackCategoryComponent } from './feedback/feedback-category/feedback-category.component';
import { ReportedCarsComponent } from './feedback/reported-cars/reported-cars.component';
import { ReportedCarDetailComponent } from './feedback/reported-cars/reported-car-detail/reported-car-detail.component';
import { SuperAdminCheckPassResolve } from '../../shared/Resolve/super-admin-checkpass';
import { DialogModule } from 'primeng/dialog';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TransactionReportDetailsComponent } from './admin-reports/transaction-report-details/transaction-report-details.component';

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
          title: 'Dashboard'
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'agents',
        component: AgentsComponent,
        data: {
          title: 'Manage Agents',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Agents' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'agents/view/:id',
        component: AgentDetailComponent,
        data: {
          title: 'View Agent Detail',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Agents', url: '/admin/agents' }, { title: 'Agent Detail' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          title: 'Manage Staffs',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Staff' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'staff/view/:id',
        component: StaffDetailComponent,
        data: {
          title: 'View Staff',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Staff', url: '/admin/staff' }, { title: 'Staff Detail' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
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
            resolve: {
              admin: SuperAdminCheckPassResolve
            }
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
            resolve: {
              admin: SuperAdminCheckPassResolve
            }
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
            resolve: {
              admin: SuperAdminCheckPassResolve
            }
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
                url: '/admin/car-rental-companies/view/:id'
              },
              { title: 'Car Detail' }]
            },
            resolve: {
              admin: SuperAdminCheckPassResolve
            }
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
            resolve: {
              admin: SuperAdminCheckPassResolve
            }
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
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'users/view/:id',
        component: UserDetailsComponent,
        data: {
          title: 'View User Detail',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Users', url: '/admin/users' }, { title: 'User Detail' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'users/history/:id',
        component: RentalHistoryComponent,
        data: {
          title: 'View Rental History',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Users', url: '/admin/users' }, { title: 'Rental History' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'transactions',
        component: TransactionComponent,
        data: {
          title: 'Manage Transactions',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Transactions' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
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
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'transactions/invoice/:id',
        component: AdminInvoiceComponent,
        data: {
          title: 'View Tax Invoice',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Transactions',
            url: '/admin/transactions'
          }, { title: 'Invoice Detail' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'reports/car-reports',
        component: AdminCarReportComponent,
        data: {
          title: 'Manage Car Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Car Reports' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'reports/user-reports',
        component: AdminUsersReportComponent,
        data: {
          title: 'Manage User Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'User Reports' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'reports/transaction-reports',
        component: TransactionReportComponent,
        data: {
          title: 'Transaction Reports',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Transaction Reports' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'reports/transaction-reports/view/:id',
        component: TransactionReportDetailsComponent,
        data: {
          title: 'Transaction Reports view',
           urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Transaction Reports View' }]
        },
        resolve: {
            admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations',
        data: {
          title: 'Operations',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Operations' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-delivering',
        component: DeliveredCarsComponent,
        data: {
          title: 'Manage Delivering  Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Delivering Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-delivering/view/:id',
        component: DeliveredTrackingComponent,
        data: {
          title: 'Track Delivering Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Delivering Cars',
            url: '/admin/operations/car-delivering'
          }, { title: 'Track Delivering Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-delivering/delivered/view/:id',
        component: DeliveredTrackingComponent,
        data: {
          title: 'Track Delivered Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Delivering Cars',
            url: '/admin/operations/car-delivering'
          }, { title: 'Track Delivered Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-returning',
        component: TakenAwayCarsComponent,
        data: {
          title: 'Manage Returning Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Returning Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-returning/view/:id',
        component: TakenAwayTrackingComponent,
        data: {
          title: 'Track Returning Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Returning Cars',
            url: '/admin/operations/car-returning'
          }, { title: 'Track Returning Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'operations/car-returning/returned/view/:id',
        component: ReturnedTrackingComponent,
        data: {
          title: 'Track Returned Cars',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, {
            title: 'Returning Cars',
            url: '/admin/operations/car-returning'
          }, { title: 'Track Returning Cars' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Settings',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Settings' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'account-setting',
        component: AdminAccountSettingComponent,
        data: {
          title: 'Account Setting',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Account Settings' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
        }
      },
      {
        path: 'legal_settings',
        component: AdminTermsComponent,
        data: {
          title: 'Legal Settings',
          urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Legal Settings' }]
        },
        resolve: {
          admin: SuperAdminCheckPassResolve
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
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'coupons',
    component: CouponsComponent,
    data: {
      title: 'Manage Coupons',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Coupons' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'feedback/category',
    component: FeedbackCategoryComponent,
    data: {
      title: 'Manage Categories',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Categories' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'feedback/reported-cars',
    component: ReportedCarsComponent,
    data: {
      title: 'Manage Reported Cars',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Reported Cars' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },




  {
    path: 'feedback/reported-cars/view/:id',
    component: ReportedCarDetailComponent,
    data: {
      title: 'View Reported Cars',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Reported Cars', url: '/admin/feedback/reported-cars' },
      { title: 'Reported Car Detail' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },




  {
    path: 'help/article-list',
    component: ArticleListComponent,
    data: {
      title: 'Manage Articles',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' }, { title: 'Articles' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'help/article-list/edit/:id',
    component: AddEditArticleComponent,
    data: {
      title: 'Edit Article',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' },
      {
        title: 'Articles',
        url: '/admin/help/article-list'
      },
      { title: 'Edit Article' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'help/article-list/view/:id',
    component: ArticleDetailComponent,
    data: {
      title: 'View Article',
      urls: [{ title: 'Dashboard', url: '/admin/dashboard' },
      {
        title: 'Articles',
        url: '/admin/help/article-list'
      },
      { title: 'View Article' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
  {
    path: 'help/article-list/add',
    component: AddEditArticleComponent,
    data: {
      title: 'Add Article',
      urls: [{ title: 'Admin Dashboard', url: '/admin/dashboard' },
      {
        title: 'Articles',
        url: '/admin/help/article-list'
      },
      { title: 'Add Article' }]
    },
    resolve: {
      admin: SuperAdminCheckPassResolve
    }
  },
];

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
    DialogModule,
    ToastModule,
    InputSwitchModule,
    TooltipModule,
    MenuModule,
    QuillModule,
    EditorModule,
    CheckboxModule,
    Ng4GeoautocompleteModule.forRoot(),
    CalendarModule,
    DropdownModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_api_key,
    }),
    AgmDirectionModule,
    UiSwitchModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
  ],
  exports: [RouterModule],
  declarations: [
    AgentsComponent,
    StaffComponent,
    CarRentalCompaniesComponent,
    AdminComponent,
    UsersComponent,
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
    ArticleListComponent,
    AddEditArticleComponent,
    ArticleDetailComponent,
    DeliveringTrackingComponent,
    ReturnedTrackingComponent,
    AdminInvoiceComponent,
    FeedbackCategoryComponent,
    ReportedCarsComponent,
    ReportedCarDetailComponent,
    TransactionReportDetailsComponent,
  ],
  providers: []
})
export class AdminModule { }
