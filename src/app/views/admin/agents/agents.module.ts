import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsComponent } from './agents.component';
// import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { AgentAddEditModule } from '../../../shared/model-popup/agent-add-edit/agent-add-edit.module';
import { AgentsRoutingModule } from './agents-routing.module';


@NgModule({
  imports: [
    CommonModule,
    AgentAddEditModule,
    AgentsRoutingModule
  ],
  // declarations: [AgentDetailComponent]
})
export class AgentsModule { }
