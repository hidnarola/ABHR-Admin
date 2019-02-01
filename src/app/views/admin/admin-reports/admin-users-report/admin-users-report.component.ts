import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-users-report',
  templateUrl: './admin-users-report.component.html',
  styleUrls: ['./admin-users-report.component.css']
})
export class AdminUsersReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public reports;
  // Data table parameters
  dtparams: any;
  DDfilter = '';
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  public newDate;
  public model: NgbDateStruct;
  isCols: boolean;
  public pageNumber;
  public totalRecords;
  selectFromDate: Array<Date>;
  selectToDate: Array<Date>;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
  ) { }

  DatePicker(date: NgbDateStruct) {
    console.log('check => ', date);
    this.newDate = date.year + '-' + date.month + '-' + date.day;
    console.log('newDate => ', this.newDate);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  ngOnInit() {
    this.ReportData();
  }

  ReportData() {
    try {
      this.spinner.show();

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
          dataTablesParameters['columns'][5]['isNumber'] = true;
          dataTablesParameters['columns'][6]['isNumber'] = true;
          setTimeout(() => {
            // if (filterBy) { dataTablesParameters['filtered_by'] = filterBy; }
            if (this.newDate !== '') {
              dataTablesParameters['date'] = this.newDate;
            }
            this.service.post('admin/user/report_list', dataTablesParameters).subscribe(res => {
              console.log('dataTablesParameters in user report => ', dataTablesParameters);
              this.reports = res['result']['data'];
              this.totalRecords = res['result']['recordsTotal'];
              // this.reports = [];
              if (this.reports.length > 0) {
                this.isCols = true;
                $('.dataTables_wrapper').css('display', 'block');
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
            data: 'First Name',
            name: 'first_name',
          },
          {
            data: 'Last Name',
            name: 'last_name',
          },
          {
            data: 'No Of Rented',
            name: 'no_of_rented',
          },
          {
            data: 'Total Rent',
            name: 'totalrent',
          },
        ]
      };
    } catch (error) {
      console.log('error => ', error);
    }

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
