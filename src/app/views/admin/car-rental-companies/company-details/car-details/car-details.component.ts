import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../../../../environments/environment';
// services
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
    private dataService: DataSharingService,
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    // this.StartDate = moment().startOf('year').format('YYYY/MM/DD');
    // console.log('this.StartDate => ', this.StartDate);
    // this.EndDate = moment().endOf('year').format('YYYY/MM/DD');
    // console.log('this.EndDate => ', this.EndDate);
    // this.dates = this.getDates(moment(this.StartDate).format('YYYY-MM-DD'), moment(this.EndDate).format('YYYY-MM-DD'));
    // console.log('dates====>', this.dates);


    this.route.params.subscribe(params => { this.carId = params.id; });
  }

  CarDetails() {
    this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(res => {
      this.carDetails = res['data'][0];
      console.log('this.carDetails => ', this.carDetails.availableData);
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
    });
  }

  // handleCloseCalendar = () => {
  //   this.datePicker.overlayVisible = false;
  // }

  ngOnInit() {
    this.CarDetails();
  }




  // Returns an array of dates between the two dates
  // getDates(startDate, endDate) {
  //   var dates = [],
  //     currentDate = startDate,
  //     addDays = function (days) {
  //       var date = new Date(this.valueOf());
  //       date.setDate(date.getDate() + days);
  //       return date;
  //     };
  //   while (currentDate <= endDate) {
  //     const dateMom = moment(currentDate).format('YYYY-MM-DD');
  //     dates.push(dateMom);
  //     currentDate = addDays.call(currentDate, 1);
  //   }
  //   return dates;
  // }

  // Usage

  // dates.forEach(function(date) {
  //   console.log(date);
  // })




}
