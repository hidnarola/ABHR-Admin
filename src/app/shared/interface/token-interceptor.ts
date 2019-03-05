import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { CrudService } from '../services/crud.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public companyId;

  constructor(
    private router: Router,
    public service: CrudService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // console.log("request response:", event);
        // do stuff with response if you want
        var user = JSON.parse(localStorage.getItem('admin'));
        var company = JSON.parse(localStorage.getItem('company-admin'));
        var token = localStorage.getItem('token');
        let tokenInfo = this.getDecodedAccessToken(token); // decode token
        // if (user != null && user !== undefined) {
        //   if (tokenInfo === false) {
        //     this.router.navigate(['/admin/login']);
        //     localStorage.clear();
        //   }
        // }
        // if (company != null && company !== undefined) {
        //   this.companyId = company._id;
        //   if (tokenInfo === false) {
        //     this.router.navigate(['/company/login']);
        //     localStorage.clear();
        //   }
        // }
      }
    }, (err: any) => { });
  }

  // getDecodedAccessToken(token: string): any {
  //   try {
  //     return jwt_decode(token);
  //   }catch (Error) {
  //     return null;
  //   }
  // }

  getDecodedAccessToken(token: string): any {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp > Number(new Date().valueOf() / 1000);
    } catch (Error) {
      return false;
    }
  }




}
