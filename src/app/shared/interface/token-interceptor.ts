import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CrudService } from '../services/crud.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public companyId;

  constructor(
    public service: CrudService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) { }
    }, (err: any) => { });
  }
}
