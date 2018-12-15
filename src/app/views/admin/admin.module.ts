import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule} from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import { AdminComponent } from './admin.component';
// Child components
import { AgentsComponent } from './agents/agents.component';
import { StaffComponent } from './staff/staff.component';
import { CarRentalCompaniesComponent } from './car-rental-companies/car-rental-companies.component';
import { AdminTransactionsComponent } from './admin-transactions/admin-transactions.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { UsersComponent } from './users/users.component';
import { OperationsComponent } from './operations/operations.component';
import { SettingsComponent } from './settings/settings.component';
import { AgentDetailComponent } from './agents/agent-detail/agent-detail.component';
import { CompanyDetailsComponent } from './car-rental-companies/company-details/company-details.component';
import { StaffDetailComponent } from './staff/staff-detail/staff-detail.component';



const AdminRoutes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin Dashboard'
    },
    children: [
      {
        path: 'dashboard',
        component: AdminComponent,
        data: {
          title: 'Admin Dashboard',
          urls: [{title: 'Admin Dashboard',url: '/admin'}]
        },
      },
      {
        path: 'agents',
        component: AgentsComponent,
        data: {
          title: 'Manage Agents',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Agents'}]
        },
      },
      {
        path: 'agents/view/:id',
        component: AgentDetailComponent,
        data: {
          title: 'Manage Agents',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Agents', url: '/admin/agents'}, {title: 'view'}]
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          title: 'Manage Staff',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Staff'}]
        },
      },
      {
        path: 'staff/view/:id',
        component: StaffDetailComponent,
        data: {
          title: 'Manage Staff',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Staff', url: '/admin/staff'}, {title: 'view'}]
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
            urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Companies'}]
            },
          },
          {
            path: 'car-rental-companies/view/:id',
            component: CompanyDetailsComponent,
            data: {
            title: 'Manage Companies',
            urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Companies', url: '/admin/car-rental-companies'}, {title: 'view'}]
            },
          }
        ] 
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Manage Users',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Users'}]
        },
      },
      {
        path: 'transactions',
        component: AdminTransactionsComponent,
        data: {
          title: 'Manage Transactions',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Transactions'}]
        },
      },
      {
        path: 'reports',
        component: AdminReportsComponent,
        data: {
          title: 'Manage Reports',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Reports'}]
        },
      },
      {
        path: 'operations',
        component: OperationsComponent,
        data: {
          title: 'Operations',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Operations'}]
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Settings',
          urls: [{title: 'Admin Dashboard',url: '/admin/dashboard'},{title: 'Settings'}]
        },
      },
    ]
  },
]
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
      ConfirmDialogModule
    ],
    exports: [RouterModule],
    declarations: [
        AgentsComponent,
        StaffComponent,
        CarRentalCompaniesComponent,
        AdminComponent,
        AdminTransactionsComponent,
        AdminReportsComponent,
        UsersComponent,
        OperationsComponent,
        SettingsComponent,
        AgentDetailComponent,
        StaffDetailComponent,
        CompanyDetailsComponent
    ]
})
export class AdminModule { }