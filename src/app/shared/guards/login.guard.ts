import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  public CurrentAdmin;
  public userType;
  public AdminDetail;
  public adminUserType;
  public CompanyDetail;
  public companyUserType;
  public siteURL;

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const array = url.split('/');
    this.CurrentAdmin = array[1];
    let islogin = false;
    let loginUserAdmin = JSON.parse(localStorage.getItem('admin'));
    if (this.userType !== null && this.userType !== undefined) {
      this.userType = loginUserAdmin.type;
    }
    let loginUserCompany = JSON.parse(localStorage.getItem('company-admin'));
    if (this.siteURL !== null && this.siteURL !== undefined) {
      this.siteURL = loginUserCompany.site_url;
    }
    const token = localStorage.getItem('token');
    if (this.CurrentAdmin === 'admin') {
      try {
        if (loginUserAdmin['_id'] && token) {
          islogin = true;
        } else {
          islogin = false;
        }
      } catch (e) {
        islogin = false;
      }
      if (islogin) {
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
    } else if (this.CurrentAdmin === 'company') {

      try {
        if (loginUserCompany['_id'] && token) {
          islogin = true;
        } else {
          islogin = false;
        }
      } catch (e) {
        islogin = false;
      }
      if (islogin) {
        this.router.navigate(['/company/dashboard']);
        return false;
      }
    } else if ((this.CurrentAdmin === 'reset-password') || (this.CurrentAdmin === 'confirm-reset-password')) {
      if (loginUserAdmin !== null && loginUserAdmin !== undefined) {
        this.userType = loginUserAdmin.type;
      }
      if (this.userType === 'admin') {
        try {
          if (loginUserAdmin['_id'] && token) {
            islogin = true;
          } else {
            islogin = false;
          }
        } catch (e) {
          islogin = false;
        }
        if (islogin) {
          this.router.navigate(['/admin/dashboard']);
        }
        return false;
      } else if (!(this.siteURL) || (this.siteURL === undefined) || (this.siteURL === null)) {
        try {
          if (loginUserCompany['_id'] && token) {
            islogin = true;
          } else {
            islogin = false;
          }
        } catch (e) {
          islogin = false;
        }
        if (islogin) {
          this.router.navigate(['/company/dashboard']);
          // return false;
        }
      } else { }
    } else { }
    return true;
  }
}

