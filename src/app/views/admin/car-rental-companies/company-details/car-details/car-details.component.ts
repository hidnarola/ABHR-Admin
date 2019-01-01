import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../../../../environments/environment';
// services
import { CrudService } from '../../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../../shared/services/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  public carId;
  public carDetails;
  public carGallery;
  public imgUrl = environment.imgUrl;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private dataService: DataSharingService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => { this.carId = params.id; });
    console.log('carId==>', this.carId)

  }

  CarDetails() {
    // this.dataService.changeLoading(true);
    this.spinner.show();

    this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(res => {
      console.log('cardetails RES==>', res);
      this.carDetails = res['data'].carDetail;
      localStorage.setItem('companyId', this.carDetails.car_rental_company_id);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  ngOnInit() {
    this.CarDetails();
  }

}