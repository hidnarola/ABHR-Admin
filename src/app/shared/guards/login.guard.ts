import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router){}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let islogin = false;
    let loginUser = localStorage.getItem('admin');
    let token = localStorage.getItem('token');
    try {
      loginUser = JSON.parse(loginUser);
      if (loginUser['_id'] && token) {
        console.log('login===>',)
        islogin = true;
      } else {
        islogin = false;
      }
    } 
    catch (e) {
      islogin = false;
    }
    if (islogin) {
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
    return true;
  }

}
