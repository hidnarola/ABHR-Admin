import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit, AfterViewInit {

  public currentYear;
  public superAdmin;
  public company;

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.superAdmin = JSON.parse(localStorage.getItem('admin'));
    this.company = JSON.parse(localStorage.getItem('company-admin'));
  }

  ngOnInit() { }

  ngAfterViewInit() {

    $(function () {
      $('.preloader').fadeOut();
    });
  }

}
