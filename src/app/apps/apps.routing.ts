import { Routes } from '@angular/router';

import { EmailComponent } from './email/email.component';
import { TaskboardComponent } from './taskboard/taskboard.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'email',
        component: EmailComponent,
        data: {
          title: 'Email Page',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Email Page' }]
        }
      },
      {
        path: 'taskboard',
        component: TaskboardComponent,
        data: {
          title: 'Taskboard',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Taskboard' }]
        }
      }]
  }
];
