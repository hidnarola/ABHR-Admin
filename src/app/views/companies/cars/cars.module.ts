import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import { CarsComponent } from './cars.component';

// const routes: Routes = [
//     {
//         path: '',
//         component: CarsComponent,
//         data: {
//             title: 'Manage Car Rental Companies'
//         }
//     }
// ]

@NgModule({
  imports: [
    CommonModule,
    //   RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  // declarations: [CarsComponent]
})

export class CarsModule { }
