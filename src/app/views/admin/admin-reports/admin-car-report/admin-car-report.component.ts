import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-car-report',
  templateUrl: './admin-car-report.component.html',
  styleUrls: ['./admin-car-report.component.css']
})
export class AdminCarReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  public reports;
  // Data table parameters
  dtparams: any;
  DDfilter = '';
  isCols: boolean;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  // public pageNumber = 10;
  public pageNumber;
  public newDate;
  public model: NgbDateStruct;
  public totalRecords;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
  ) { }

  DatePicker(date: NgbDateStruct) {
    console.log('check => ', date);
    this.newDate = date.year + '-' + date.month + '-' + date.day;
    console.log('newDate in car report => ', this.newDate);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


  ngOnInit() {

    try {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        destroy: true,
        processing: true,
        serverSide: true,
        ordering: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
        ajax: (dataTablesParameters: any, callback) => {
          this.pageNumber = dataTablesParameters.length;
          this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][3]['isNumber'] = true;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          console.log(dataTablesParameters);
          this.spinner.show();
          setTimeout(() => {
            // if (filterBy) { dataTablesParameters['filtered_by'] = filterBy; }
            if (this.newDate !== '') {
              dataTablesParameters['date'] = this.newDate;
            }
            console.log('dataTablesParameters in car report => ', dataTablesParameters);
            this.service.post('admin/cars/report_list', dataTablesParameters).subscribe(async (res: any) => {
              console.log('response====>', res);
              this.reports = await res['result']['data'];
              this.totalRecords = res['result']['recordsTotal'];
              // this.reports = [];
              this.spinner.hide();
              if (this.reports.length > 0) {
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
            data: 'Car Brand',
            name: 'car_brand',
          },
          {
            data: 'Car Modal',
            name: 'car_modal',
          },
          {
            data: 'Compnay Name',
            name: 'company_name',
          },
          {
            data: 'No Of Rented',
            name: 'no_of_rented',
          },
          {
            data: 'Total Rent',
            name: 'totalrent',
          },
        ],
        // dom: 'Bfrtip',
        // buttons: [
        //   'excel',
        //   'copy'
        // ]
      };
    } catch (error) {
      console.log('error => ', error);
      this.spinner.hide();
    }
    this.spinner.hide();
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
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

}
