import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RentalModule } from '../shared/components/rentals-for-car/rentals.module';
// import { RentalsComponent } from '../shared/components/rentals-for-car/rentals.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    imports: [
      CommonModule,
      // RentalModule,
      DataTablesModule,
    ],
    declarations: [
    //   RentalsComponent,
    ]
  })
  export class ViewsModule { }
