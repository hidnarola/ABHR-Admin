import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private adminU: AdminUser;
  // private companyU: CompanyUser;
  private isLoginSource = new BehaviorSubject(null);
  private isPageSource = new BehaviorSubject(null);
  private loadingSource = new BehaviorSubject(null);
  private adminUser = new BehaviorSubject(this.adminU);
  // private companyUser = new BehaviorSubject(this.companyU);
  private companyStatus = new BehaviorSubject(null);

  currentIsLogin = this.isLoginSource.asObservable();
  currentPage = this.isPageSource.asObservable();
  currentloading = this.loadingSource.asObservable();
  currentAdminUser = this.adminUser.asObservable();
  // currentCompanyUser = this.companyUser.asObservable();
  currentCompanyStatus = this.companyStatus.asObservable();


  constructor() { }

  changeIsLogin(message: string) {
    this.isLoginSource.next(message);
  }

  changePages(message: string) {
    this.isPageSource.next(message);
  }

  changeLoading(value) {
    this.loadingSource.next(value);
  }

  changeAdminUser(value) {
    console.log('in datadshar===>', value);
    this.adminUser.next(value);
  }

  // changeCompanyUser(value) {
  //   console.log('in datadshar===>', value);
  //   this.companyUser.next(value);
  // }

  checkCompanyStatus(status: Boolean) {
    console.log('in datadshar===>', status);
    this.companyStatus.next(status);
  }


}
export interface AdminUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

