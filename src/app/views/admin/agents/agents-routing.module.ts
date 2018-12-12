import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

const AgentRoutes: Routes = []

@NgModule({
    imports: [RouterModule.forChild(AgentRoutes)],
    exports: [RouterModule]
})

export class AgentsRoutingModule { }