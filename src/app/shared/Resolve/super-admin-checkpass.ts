import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CrudService } from '../services/crud.service';

@Injectable()
export class SuperAdminCheckPassResolve implements Resolve<any> {
    public Id;
    public adminStatus;
    public adminPassword;
    constructor(
        private service: CrudService,
        private router: Router,
        private messageService: MessageService
    ) { }
    resolve(route: ActivatedRouteSnapshot) {
        var admin = JSON.parse(localStorage.getItem('admin'));
        if (admin != null && admin !== undefined) {
            this.Id = admin._id;
            this.adminPassword = admin.password;
        }
        var Obj = {
            user_id: this.Id,
            password: this.adminPassword
        };
        this.service.post('admin/check_status', Obj).subscribe(res => {
            this.adminStatus = res['status'];
            if (this.adminStatus === 'success') {
                localStorage.clear();
                this.router.navigate(['/admin/login']);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            }
        });

    }
}