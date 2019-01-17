import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
// child component
import { Routes, RouterModule } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { CompanyReportsComponent } from './company-reports/company-reports.component';
import { CompanyTransactionsComponent } from './../companies/company-transactions/company-transactions.component';
import { CompaniesComponent } from './companies.component';
import { CarDetailsComponent } from './cars/CompanyAdmin_car-details/car-details.component';
import { CarAddEditComponent } from './cars/CompanyAdmin-car-add-edit/company-admin-car-add-edit.component';
import { CompanyAccountSettingComponent } from './company-account-setting/company-account-setting.component';
import { CarReportComponent } from './company-reports/car-report/car-report.component';
import { UserReportComponent } from './company-reports/user-report/user-report.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { CompanyTermsComponent } from './company-terms/company-terms.component';
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
                title: 'Dashboard',
                urls: [{ title: 'Dashboard' }]
            },
        },
        {
            path: 'car',
            component: CarsComponent,
            data: {
                title: 'Manage Cars',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars' }]
            },
        },
        {
            path: 'car/view/:id',
            component: CarDetailsComponent,
            data: {
                title: 'View Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Car Detail' }]
            },
        },
        {
            path: 'car/edit/:id',
            component: CarAddEditComponent,
            data: {
                title: 'Edit Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Edit Company' }]
            },
        },
        {
            path: 'car/add',
            component: CarAddEditComponent,
            data: {
                title: 'Add Car',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Cars', url: '/company/car' }, { title: 'Add Company' }]
            },
        },
        {
            path: 'account-setting',
            component: CompanyAccountSettingComponent,
            data: {
                title: 'Account Setting',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Account Settings' }]
            }
        },
        {
            path: 'reports',
            component: CompanyReportsComponent,
            data: {
                title: 'Manage Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Reports' }]
            },
        },
        {
            path: 'reports/car-reports',
            component: CarReportComponent,
            data: {
                title: 'Manage Car Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Reports', url: 'company/reports' },
                { title: 'Car Reports' }]
            },
        },
        {
            path: 'reports/user-reports',
            component: UserReportComponent,
            data: {
                title: 'Manage User Reports',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Reports', url: 'company/reports' },
                { title: 'User Reports' }]
            },
        },
        {
            path: 'terms_and_conditions',
            component: CompanyTermsComponent,
            data: {
                title: 'Terms & Conditions',
                urls: [{ title: 'Dashboard', url: '/company/dashboard' }, { title: 'Terms & Conditions' }]
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
},
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        ReactiveFormsModule,
        // ConfirmDialogModule,
        ToastModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
        RouterModule.forChild(CompanyRoutes)
    ],
    exports: [RouterModule],
    declarations: [
        CarsComponent,
        CarDetailsComponent,
        CarAddEditComponent,
        CompanyTransactionsComponent,
        CompanyReportsComponent,
        CompaniesComponent,
        CompanyAccountSettingComponent,
        CarReportComponent,
        UserReportComponent,
        KeywordsComponent,
        CompanyTermsComponent,
        // RentalsComponent,
    ]
})
export class CompaniesModule { }
