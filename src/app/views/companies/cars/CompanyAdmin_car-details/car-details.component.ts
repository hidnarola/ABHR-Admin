import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../../../environments/environment';
// services
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  public carId;
  public carDetails;
  public imgUrl = environment.imgUrl;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => { this.carId = params.id; });
    console.log('carId==>', this.carId);
  }

  CarDetails() {
    this.spinner.show();
    this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(res => {
      console.log('cardetails RES==>', res);
      this.carDetails = res['data'].carDetail;
      console.log('carDetails ==>', this.carDetails);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  ngOnInit() {
    this.CarDetails();
  }

}
