import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private adminU: AdminUser;
  private companyPass: CompanyPassword;
  private adminPass: AdminPassword;
  private isLoginSource = new BehaviorSubject(null);
  private isPageSource = new BehaviorSubject(null);
  private loadingSource = new BehaviorSubject(null);
  private adminUser = new BehaviorSubject(this.adminU);
  private companyPassword = new BehaviorSubject(this.companyPass);
  private adminPassword = new BehaviorSubject(this.adminPass);
  private companyStatus = new BehaviorSubject(null);
  private sidebarStatus = new BehaviorSubject(null);

  currentIsLogin = this.isLoginSource.asObservable();
  currentPage = this.isPageSource.asObservable();
  currentloading = this.loadingSource.asObservable();
  currentAdminUser = this.adminUser.asObservable();
  currentCompanyPass = this.companyPassword.asObservable();
  currentAdminPass = this.adminPassword.asObservable();
  currentCompanyStatus = this.companyStatus.asObservable();
  currentSidebarStatus = this.sidebarStatus.asObservable();

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

  checkCompanyStatus(status: Boolean) {
    console.log('in datadshar===>', status);
    this.companyStatus.next(status);
  }

  changeCompanyPassword(value) {
    console.log('in datadshar===>', value);
    this.companyPassword.next(value);
  }

  changeAdminPassword(value) {
    console.log('in datadshar===>', value);
    this.adminPassword.next(value);
  }

  checkSidebar(status: Boolean) {
    console.log('in datadshar===>', status);
    this.sidebarStatus.next(status);
  }

}
export interface AdminUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
export interface CompanyPassword {
  password: string;
}
export interface AdminPassword {
  password: string;
}
