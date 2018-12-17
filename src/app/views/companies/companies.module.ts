import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

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
                urls: [{title: 'Dashboard',url: '/company'},{ title: 'Cars'}]
            },
        },
        {
            path: 'cars',
            component: CarsComponent,
            data: {
                title: 'Cars',
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