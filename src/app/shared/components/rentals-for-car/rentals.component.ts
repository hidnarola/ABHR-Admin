import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
// services
import { CrudService } from '../../../shared/services/crud.service';
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public rentalData;
  public carId;
  isCols: boolean;
  public pageNumber;
  public totalRecords;
  constructor(
    private route: ActivatedRoute,
    public renderer: Renderer,
    private service: CrudService,
    private dataShare: DataSharingService,
    private spinner: NgxSpinnerService,
  ) {
    this.route.params.subscribe(params => { this.carId = params.id; });
    console.log('carId in rentals==>', this.carId);
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
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      language: {
        'processing': '',
      },
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
        console.log('dataparametes in rental==>', dataTablesParameters);
        dataTablesParameters['columns'][0]['isNumber'] = true;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        setTimeout(() => {
          dataTablesParameters.car_id = this.carId;
          this.service.post('company/car/rented_list', dataTablesParameters).subscribe(res => {
            console.log('res in rental -------', res);
            this.rentalData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.rentalData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            } else {
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
            this.spinner.hide();
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
            window.scrollTo(0, 0);
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
          name: 'user_name'
        },
        {
          data: 'Price',
          name: 'booking_rent'
        },
        {
          data: 'Start Of Rent',
          name: 'from_time'
        },
        {
          data: 'End Of Rent',
          name: 'to_time'
        }
      ]
    };
  }
}
