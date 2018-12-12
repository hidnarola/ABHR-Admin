import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './shared/guards/auth.guard';

import { AdminModule } from '../app/views/admin/admin.module'
import { LoginGuard } from './shared/guards/login.guard';
// import { AdminComponent } from './views/admin/admin.component';

export const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            { path: 'admin', loadChildren: './views/admin/admin.module#AdminModule',
            canActivate: [AuthGuard]
        },
            { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full', 
            canActivate: [AuthGuard] 
        },
        ]
    },
    {
        path: '',
        component: BlankComponent,
        children: [
            // {
            //     path: 'authentication',
            //     loadChildren: './authentication/authentication.module#AuthenticationModule'
            // },
            {
                path: 'admin',
                loadChildren: './authentication/authentication.module#AuthenticationModule',
                // canActivate: [AuthGuard],
            },
            {
                path: 'reset-password',
                loadChildren: './reset-password/reset-password.module#ResetPasswordModule',
                canActivate: [LoginGuard],
            }
        ]
    },
    {
        path: '**',
        redirectTo: '404'
    }];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false }), NgbModule.forRoot()],
    exports: [RouterModule]
})
export class AppRoutingModule { }

