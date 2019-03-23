import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class CompanyAdminStatusResolve implements Resolve<any> {
    public companyId;
    public companyStatus;
    public companyPassword;
    constructor(
        private service: CrudService,
        private router: Router,
        private messageService: MessageService
    ) { }
    resolve(route: ActivatedRouteSnapshot) {
        console.log('in resolve => ');
        var company = JSON.parse(localStorage.getItem('company-admin'));
        console.log('company => ', company);
        if (company != null && company !== undefined) {
            this.companyId = company._id;
            this.companyPassword = company.password;
        }
        var Obj = {
            user_id: this.companyId,
            password: this.companyPassword
        };
        this.service.post('company/check_status', Obj).subscribe(res => {
            this.companyStatus = res['status'];
            if (this.companyStatus === 'success') {
                localStorage.clear();
                this.router.navigate(['/company/login']);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            }
        });

    }
}
