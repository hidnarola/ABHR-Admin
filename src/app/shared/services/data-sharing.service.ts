import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private isLoginSource = new BehaviorSubject(null);
  private isPageSource = new BehaviorSubject(null);
  private loadingSource = new BehaviorSubject(null);

  currentIsLogin = this.isLoginSource.asObservable();
  currentPage = this.isPageSource.asObservable();
  currentloading = this.loadingSource.asObservable();

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
  
}
