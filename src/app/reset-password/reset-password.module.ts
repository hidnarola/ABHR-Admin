import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {ToastModule} from 'primeng/toast';

const ResetPasswordRoutes: Routes =[
  {
    path: '',
    component: ResetPasswordComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ResetPasswordRoutes),
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [
    ResetPasswordComponent
  ]
})
export class ResetPasswordModule { }
