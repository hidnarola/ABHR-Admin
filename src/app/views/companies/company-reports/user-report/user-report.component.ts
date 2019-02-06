import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ExcelService } from '../../../../shared/services/excel.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('filter_report') datePicker;
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
  public companyId;
  isCols: boolean;
  public pageNumber;
  public totalRecords;
  selectFromDate: Array<Date>;
  selectToDate: Array<Date>;
  rangeDates: Date[];
  public exportParam: any;
  public exportData: any;
  public ExcelArray = [];
  isExcel: boolean;
  isPDF: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    console.log('companyid in car reports==>', this.companyId);
  }

  DatePicker(date: NgbDateStruct) {
    console.log('check => ', date);
    this.newDate = date.year + '-' + date.month + '-' + date.day;
    console.log('newDate => ', this.newDate);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  FilterRange() {
    console.log('rangeDates in filter function => ', this.rangeDates);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ngOnInit() {
    this.ReportData();
    setTimeout(() => {
      this.ExportRecords();
    }, 500);
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
        language: { 'processing': '<i class="fa fa-spin fa-spinner"></i>' },
        ajax: (dataTablesParameters: any, callback) => {
          this.pageNumber = dataTablesParameters.length;
          dataTablesParameters['company_id'] = this.companyId;
          this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          dataTablesParameters['columns'][5]['isNumber'] = true;
          setTimeout(() => {
            if (this.rangeDates) {
              if (this.rangeDates[1]) {
                dataTablesParameters['selectFromDate'] = moment(this.rangeDates[0]).format('L');
                dataTablesParameters['selectToDate'] = moment(this.rangeDates[1]).format('L');
                this.datePicker.overlayVisible = false;
              }
            }
            this.service.post('company/users/report_list', dataTablesParameters).subscribe(res => {
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
              console.log('response in reports', res);
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
            data: 'First Name',
            name: 'first_name',
          },
          {
            data: 'Last Name',
            name: 'last_name',
          },
          {
            data: 'Status',
            name: 'trip_status',
          },
          {
            data: 'Total Rent',
            name: 'booking_rent',
          },
          {
            data: 'From Date',
            name: 'from_time',
          },
          {
            data: 'To Date',
            name: 'to_time',
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
  handleFilterCalendar = () => {
    this.datePicker.overlayVisible = false;
    console.log('this.rangeDates  => ', this.rangeDates);
  }
  handleClearCalendar = () => {
    this.rangeDates = null;
    console.log('this.rangeDates  => ', this.rangeDates);
    this.datePicker.overlayVisible = false;
    this.render();
    this.spinner.show();
  }
  ExportRecords() {
    console.log('here in export fun => ');
    this.service.post('company/users/export_report_list', this.exportParam).subscribe(async (res: any) => {
      this.exportData = await res['result']['data'];
      this.isExcel = false;
      this.isPDF = false;
      console.log('this.exportData => ', this.exportData);
      this.exportData.forEach(item => {
        let obj = {
          'First_Name': item.first_name,
          'Last_Name': item.last_name,
          'Company_Name': item.company_name,
          'Status': item.trip_status,
          'Total Rent': item.booking_rent,
          'From_Date': moment(item.from_time).format('LL'),
          'To_Date': moment(item.to_time).format('LL'),
        };
        this.ExcelArray.push(obj);
      });

      console.log('excel data====>', this.ExcelArray);
    });
  }

  exportAsXLSX(): void {
    this.isExcel = true;
    this.ExportRecords();
    this.excelService.exportAsExcelFile(this.ExcelArray, 'sample');
  }

  public captureScreen() {
    this.isPDF = true;
    this.ExportRecords();
    var pdfdata = document.getElementById('contentToConvert');
    html2canvas(pdfdata).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 500;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Users-report.pdf'); // Generated PDF   
    });
  }
}
