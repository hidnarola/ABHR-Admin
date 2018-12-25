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

  constructor(private router: Router){}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    console.log('url in guard', url)
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    var array = url.split('/');
    this.CurrentAdmin = array[1];
    console.log('array var==>', array[1])
    let islogin = false;
    let loginUserAdmin = localStorage.getItem('admin');
    console.log('login user ==>', loginUserAdmin)
    let loginUserCompany = localStorage.getItem('company-admin');
    let token = localStorage.getItem('token');
   // this.userType = this.token.
    // try {
    //   loginUser = JSON.parse(loginUser);
    //   if (loginUser['_id'] && token) {
    //     islogin = true;
    //   } else {
    //     islogin = false;
    //   }
    // } 
    // catch (e) {
    //   islogin = false;
    // }
    // if (islogin) {
    //   this.router.navigate(['/admin/dashboard']);
    //   return false;
    // }
    // return true;
    if(this.CurrentAdmin == 'admin'){
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
      if (islogin) {
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
     }
     else if(this.CurrentAdmin == 'company'){
     
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
      if (islogin) {
        this.router.navigate(['/company/dashboard']);
        return false;
      }
     }
     else if(this.CurrentAdmin == 'reset-password'){
      loginUserAdmin = JSON.parse(loginUserAdmin);
      this.AdminDetail = loginUserAdmin;
      console.log('login user admin detail', loginUserAdmin);
      this.adminUserType = this.AdminDetail.type;
      console.log('user type ==>', this.adminUserType)

      // loginUserCompany = JSON.parse(loginUserCompany);
      // console.log('here', loginUserCompany)
      // this.CompanyDetail = loginUserCompany;
      // console.log('company details', this.CompanyDetail)
      // this.companyUserType = this.CompanyDetail.type;
      // console.log('user type ==>', this.companyUserType)
      if(this.adminUserType == 'admin'){
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
        if (islogin) {
          this.router.navigate(['/admin/dashboard']);
          // return false;
        }
        return false;
      }
     }


     return true;
     }
    
  }

