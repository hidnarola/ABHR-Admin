import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmResetComponent } from './confirm-reset.component';

const ConfirmResetRoutes: Routes = [
  {
    path: '',
    component: ConfirmResetComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ConfirmResetRoutes),
  ],
  declarations: [ConfirmResetComponent]
})
export class ConfirmResetModule { }
