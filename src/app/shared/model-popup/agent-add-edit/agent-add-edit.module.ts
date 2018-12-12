import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentAddEditComponent } from './agent-add-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AgentAddEditComponent],
  entryComponents: [AgentAddEditComponent],
  exports: [AgentAddEditComponent]
})
export class AgentAddEditModule { }
