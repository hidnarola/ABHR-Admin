import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../../../../environments/environment';
import { CrudService } from '../../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../../shared/services/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  @ViewChild('availibility') datePicker;
  public carId;
  public carDetails;
  public carGallery;
  public imgUrl = environment.imgUrl + 'car/';
  public SelectedDates: Array<Date>;
  public dates: Array<Date>;
  public StartDate;
  public EndDate;
  public today;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    this.route.params.subscribe(params => { this.carId = params.id; });
  }

  CarDetails() {
    this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(res => {
      this.carDetails = res['data'][0];
      if (this.carDetails.availableData !== undefined) {
        var DateArray = this.carDetails.availableData;
        const _selectDate = [];
        DateArray.forEach(element => {
          if (element.availability.length !== 0) {
            element.availability.forEach(ele => {
              if (ele !== null) {
                let Dateobj = new Date(ele);
                _selectDate.push(Dateobj);
              }
            });
          }
        });
        if (_selectDate && _selectDate.length > 0) {
          this.SelectedDates = _selectDate;
        }
      }
      let carCriteria = this.carDetails.resident_criteria;
      var CriteriaName = '';
      if (carCriteria === 0) {
        CriteriaName = 'Rented to Residents';
      } else if (carCriteria === 1) {
        CriteriaName = 'None Residents';
      } else if (carCriteria === 2) {
        CriteriaName = 'Both';
      }
      this.carDetails.resident_criteria = CriteriaName;
      localStorage.setItem('companyId', this.carDetails.car_rental_company_id);
    }, error => {
      console.log('error => ', error);
    });
  }

  ngOnInit() {
    this.CarDetails();
  }

}
