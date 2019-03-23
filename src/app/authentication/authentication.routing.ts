import { Routes } from '@angular/router';
import { NotFoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginGuard } from '../shared/guards/login.guard';


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: '404',
      //   component: NotFoundComponent
      // },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [LoginGuard]
      },
      // {
      //   path: 'reset-password',
      //   component: ResetPasswordComponent
      // },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'signup',
        component: SignupComponent
      },
    ]
  }
];
