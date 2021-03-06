import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public CurrentAdmin;

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const url: string = state.url;
    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    const array = url.split('/');
    this.CurrentAdmin = array[1];
    let islogin = true;
    let loginUserAdmin = localStorage.getItem('admin');
    let loginUserCompany = localStorage.getItem('company-admin');
    const token = localStorage.getItem('token');
    if (this.CurrentAdmin === 'admin') {
      try {
        loginUserAdmin = JSON.parse(loginUserAdmin);
        if (loginUserAdmin['_id'] && token) {
          islogin = true;
        } else {
          islogin = false;
        }
      } catch (e) {
        islogin = false;
      }
      if (!islogin) {
        this.router.navigate(['/admin/login']);
        return false;
      }
      // return true;
    } else if (this.CurrentAdmin === 'company') {
      try {
        loginUserCompany = JSON.parse(loginUserCompany);
        if (loginUserCompany['_id'] && token) {
          islogin = true;
        } else {
          islogin = false;
        }
      } catch (e) {
        islogin = false;
      }
      if (!islogin) {
        this.router.navigate(['/company/login']);
        return false;
      }
      // return true;
    }
    return true;
  }
}

