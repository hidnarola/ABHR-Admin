import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { ChartistModule} from 'ng-chartist';
import { ChartsModule } from 'ng2-charts'
//child component
import { Routes, RouterModule } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { CompanyReportsComponent } from './company-reports/company-reports.component';
import { CompanyTransactionsComponent } from './../companies/company-transactions/company-transactions.component';
import { CompaniesComponent } from './companies.component';


const CompanyRoutes: Routes = [{
    path: '',
    data: {
        title: 'Dashboard',
    },
	children: [
        {
            path : 'dashboard',
            component: CompaniesComponent,
            data: {
                title: 'Dashboard',
                urls: [{title: 'Dashboard'}]
            },
        },
        {
            path: 'cars',
            component: CarsComponent,
            data: {
                title: 'Manage Cars',
                urls: [{ title: 'Dashboard', url: '/company'},{ title: 'Cars'}]
            },
        }
    ]
}]
@NgModule({
	imports: [
    	CommonModule, 
        FormsModule,
        DataTablesModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        ToastModule,
        NgbModule,
        ChartsModule,
        ChartistModule,
    	RouterModule.forChild(CompanyRoutes)
    ],
    exports: [RouterModule],
	declarations: [
        CarsComponent,
        CompanyTransactionsComponent,
        CompanyReportsComponent,
        CompaniesComponent
    ]
})
export class CompaniesModule { }