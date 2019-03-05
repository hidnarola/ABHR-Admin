import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ToastModule } from 'primeng/toast';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
// child component
import { Routes, RouterModule } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { CompanyReportsComponent } from './company-reports/company-reports.component';
import { CompaniesComponent } from './companies.component';
import { CarDetailsComponent } from './cars/CompanyAdmin_car-details/car-details.component';
import { CarAddEditComponent } from './cars/CompanyAdmin-car-add-edit/company-admin-car-add-edit.component';
import { CompanyAccountSettingComponent } from './company-account-setting/company-account-setting.component';
import { CarReportComponent } from './company-reports/car-report/car-report.component';
import { UserReportComponent } from './company-reports/user-report/user-report.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { CompanyTermsComponent } from './company-terms/company-terms.component';
import { CancellationChargeComponent } from './cancellation-charge/cancellation-charge.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { CompanyTransactionComponent } from './company-transaction/company-transaction.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TransactionDetailComponent } from './company-transaction/transaction-detail/transaction-detail.component';
import { TransactionReportComponent } from './company-reports/transaction-report/transaction-report.component';
import { CompanyInvoiceComponent } from './company-transaction/company-invoice/company-invoice.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { CompanyAdminStatusResolve } from '../../shared/Resolve/company-admin-status';
// shared component
// import { RentalsComponent } from '../../shared/components/rentals-for-car/rentals.component';


const CompanyRoutes: Routes = [{
    path: '',
    data: {
        title: 'Dashboard',
    },
    children: [
        {
            path: 'dashboard',
            component: CompaniesComponent,
            data: {
                title: 'Dashboard'
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'car',
            component: CarsComponent,
            data: {
                title: 'Manage Cars',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'car/view/:id',
            component: CarDetailsComponent,
            data: {
                title: 'View Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Car Detail' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'car/edit/:id',
            component: CarAddEditComponent,
            data: {
                title: 'Edit Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Edit Company' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'car/add',
            component: CarAddEditComponent,
            data: {
                title: 'Add Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Add Company' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'account-setting',
            component: CompanyAccountSettingComponent,
            data: {
                title: 'Account Setting',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Account Settings' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'transactions',
            component: CompanyTransactionComponent,
            data: {
                title: 'Manage Transactions',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Transactions' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'transactions/view/:id',
            component: TransactionDetailComponent,
            data: {
                title: 'View Transactions',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, {
                    title: 'Transactions',
                    url: '/company/transactions'
                }, { title: 'Transactions Detail' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'transactions/invoice/:id',
            component: CompanyInvoiceComponent,
            data: {
                title: 'View Transactions',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, {
                    title: 'Transactions',
                    url: '/company/transactions'
                }, { title: 'Invoice Detail' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'reports',
            component: CompanyReportsComponent,
            data: {
                title: 'Manage Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Reports' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'reports/car-reports',
            component: CarReportComponent,
            data: {
                title: 'Manage Car Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' },
                { title: 'Car Reports' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'reports/user-reports',
            component: UserReportComponent,
            data: {
                title: 'Manage User Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' },
                { title: 'User Reports' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'reports/transaction-reports',
            component: TransactionReportComponent,
            data: {
                title: 'Manage Transaction Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' },
                { title: 'Transaction Reports' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        },
        {
            path: 'terms_and_insurance',
            component: CompanyTermsComponent,
            data: {
                title: 'Terms & Insurance',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Terms & Insurance' }]
            },
            resolve: {
                company: CompanyAdminStatusResolve
            }
        }
    ]
},
{
    path: 'keywords',
    component: KeywordsComponent,
    data: {
        title: 'Manage Keywords',
        urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Keywords' }]
    },
    resolve: {
        company: CompanyAdminStatusResolve
    }
},
{
    path: 'cancellation_charge',
    component: CancellationChargeComponent,
    data: {
        title: 'Manage Cancellation Charge',
        urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cancellation Charge' }]
    },
    resolve: {
        company: CompanyAdminStatusResolve
    }
},
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        ReactiveFormsModule,
        ToastModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
        EditorModule,
        CalendarModule,
        CheckboxModule,
        InputSwitchModule,
        TooltipModule,
        Ng4GeoautocompleteModule.forRoot(),
        RouterModule.forChild(CompanyRoutes)
    ],
    exports: [RouterModule],
    declarations: [
        CarsComponent,
        CarDetailsComponent,
        CarAddEditComponent,
        CompanyReportsComponent,
        CompaniesComponent,
        CompanyAccountSettingComponent,
        CarReportComponent,
        UserReportComponent,
        KeywordsComponent,
        CompanyTermsComponent,
        CancellationChargeComponent,
        ChangePassComponent,
        CompanyTransactionComponent,
        TransactionDetailComponent,
        TransactionReportComponent,
        CompanyInvoiceComponent,
        // RentalsComponent,
    ]
})
export class CompaniesModule { }
