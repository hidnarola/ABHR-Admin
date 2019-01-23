import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
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
export class CarDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public carId;
  public carDetails;
  public imgUrl = environment.imgUrl;
  public rentalData;
  isCols: boolean;
  public pageNumber;
  public totalRecords;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService,
    public renderer: Renderer,
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
      console.log('criteria name', CriteriaName);
      localStorage.setItem('companyId', this.carDetails.car_rental_company_id);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnInit() {
    this.CarDetails();
    this.RentalData();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  RentalData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        console.log('dataparametes in rental==>', dataTablesParameters);
        setTimeout(() => {
          dataTablesParameters.car_id = this.carId;
          this.service.post('admin/company/car/rental_list', dataTablesParameters).subscribe(res => {
            console.log('res in rental', res);
            this.rentalData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.rentalData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            if (this.totalRecords > this.pageNumber) {
              $('.dataTables_paginate').css('display', 'block');
            } else {
              $('.dataTables_paginate').css('display', 'none');
            }
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
          });
        }, 1000);
      },
      columns: [
        {
          data: 'Contract No.',
          name: 'booking_number'
        },
        {
          data: 'Client Name',
          name: 'userId.first_name',
        },
        {
          data: 'Price',
          name: 'booking_rent',
        },
        {
          data: 'Start Of Rent',
          name: 'from_time  | date:"MM/dd/yy" ',
        },
        {
          data: 'End Of Rent',
          name: 'to_time  | date:"MM/dd/yy"  ',
        }
      ]
    };
  }
}
