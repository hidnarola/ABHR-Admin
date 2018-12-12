import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CarsComponent } from './cars/cars.component';
import { CompanyReportsComponent } from './company-reports/company-reports.component';
import { CompanyTransactionsComponent } from './../companies/company-transactions/company-transactions.component';


const routes: Routes = [{
    path: '',
    data: {
        title: 'Manage Agents',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'cars'}]
    },
	component: CarsComponent
}]
@NgModule({
	imports: [
    	CommonModule, 
    	RouterModule.forChild(routes)
    ],
	declarations: [
        CarsComponent,
        CompanyTransactionsComponent,
        CompanyReportsComponent
    ]
})
export class CarsModule { }