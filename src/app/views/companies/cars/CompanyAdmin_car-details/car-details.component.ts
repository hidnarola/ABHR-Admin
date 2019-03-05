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
  public SelectedDates: Array<Date>;
  public today;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService,
    public renderer: Renderer,
  ) {
    this.today = new Date();
    this.route.params.subscribe(params => { this.carId = params.id; });
  }

  CarDetails() {
    this.spinner.show();
    this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(res => {
      this.carDetails = res['data'].carDetail;
      this.today = new Date();



      if (this.carDetails.is_available !== undefined) {
        var DateArray = this.carDetails.is_available;
        const _selectDate = [];
        DateArray.forEach(element => {
          if (element.availability.length !== 0) {
            element.availability.forEach(ele => {
              let Dateobj = new Date(ele);
              _selectDate.push(Dateobj);
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
    this.isCols = true;
    this.CarDetails();
    this.RentalData();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      $(table.column(idx).header()).append('<span class="sort-icon"/>');
    });
  }
  RentalData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      language: { 'processing': '' },
      responsive: true,
      destroy: true,
      // scrollX: true,
      // scrollCollapse: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][0]['isNumber'] = true;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        setTimeout(() => {
          dataTablesParameters.car_id = this.carId;
          this.service.post('admin/company/car/rental_list', dataTablesParameters).subscribe(res => {
            this.rentalData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.rentalData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            else {
              if (dataTablesParameters['search']['value'] !== '' && dataTablesParameters['search']['value'] !== null) {
                this.isCols = true;
              } else {
                this.isCols = false;
              }
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
