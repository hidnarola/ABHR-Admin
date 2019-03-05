import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class CompanyAdminStatusResolve implements Resolve<any> {
    public companyId;
    public companyStatus;
    constructor(
        private service: CrudService,
        private router: Router,
        private messageService: MessageService
    ) {
        var company = JSON.parse(localStorage.getItem('company-admin'));
        if (company != null && company !== undefined) {
            this.companyId = company._id;
        }
    }
    resolve(route: ActivatedRouteSnapshot) {
        this.service.post('company/check_status', { user_id: this.companyId }).subscribe(res => {
            this.companyStatus = res['status'];
            if (this.companyStatus === 'success') {
                localStorage.clear();
                this.router.navigate(['/company/login']);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            }
        });

    }
}
