import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';

const NotFoundRoutes: Routes = [
  {
    path: '',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NotFoundRoutes),
  ],
  declarations: [NotFoundPageComponent]
})
export class NotFoundPageModule { }
