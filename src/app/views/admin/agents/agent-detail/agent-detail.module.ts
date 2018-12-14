import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AgentDetailComponent } from './agent-detail.component';

import { RentalModule } from '../../../../shared/components/rentals/rentals.module';


@NgModule({
  imports: [
    CommonModule,
    RentalModule
  ],
  // declarations: [AgentDetailComponent]
})
export class AgentDetailModule { }
