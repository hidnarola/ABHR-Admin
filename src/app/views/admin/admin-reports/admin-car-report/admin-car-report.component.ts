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
  selector: 'app-admin-car-report',
  templateUrl: './admin-car-report.component.html',
  styleUrls: ['./admin-car-report.component.css']
})
export class AdminCarReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('filter_report') datePicker;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public reports;
  dtparams: any;
  DDfilter = '';
  isCols: boolean;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  public pageNumber;
  public newDate;
  public model: NgbDateStruct;
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
  ) { }

  DatePicker(date: NgbDateStruct) {
    this.newDate = date.year + '-' + date.month + '-' + date.day;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  FilterRange() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ngOnInit() {
    this.isCols = true;
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
        processing: true,
        serverSide: true,
        ordering: true,
        order: [[6, 'desc']],
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
          this.dtparams = dataTablesParameters;
          console.log('this.dtparams => ', this.dtparams);
          dataTablesParameters['columns'][4]['isNumber'] = true;
          console.log(dataTablesParameters);
          this.exportParam = dataTablesParameters;
          setTimeout(() => {
            if (this.rangeDates) {
              if (this.rangeDates[1]) {
                dataTablesParameters['selectFromDate'] = moment(this.rangeDates[0]).format('L');
                dataTablesParameters['selectToDate'] = moment(this.rangeDates[1]).format('L');
                this.datePicker.overlayVisible = false;
              }
            }
            console.log('dataTablesParameters in car report => ', dataTablesParameters);
            this.service.post('admin/cars/report_list', dataTablesParameters).subscribe(async (res: any) => {
              console.log('response====>', res);
              this.reports = await res['result']['data'];
              // this.reports = [];
              console.log('this.reports in cars => ', this.reports);
              this.totalRecords = res['result']['recordsTotal'];
              this.spinner.hide();
              if (this.reports.length > 0) {
                this.isCols = true;
                $('.dataTables_wrapper').css('display', 'block');
              } else {
                if ((dataTablesParameters['search']['value'] !== '' && dataTablesParameters['search']['value'] !== null) ||
                  ((dataTablesParameters['selectFromDate'] && dataTablesParameters['selectToDate']) !== '') &&
                  ((dataTablesParameters['selectFromDate'] && dataTablesParameters['selectToDate']) !== null)) {
                  this.isCols = true;
                } else if (this.rangeDates) {
                  this.isCols = true;
                } else {
                  console.log('filtered length 0 => ');
                  this.isCols = false;
                }
                console.log('record length 0 => ');
                // this.isCols = false;
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
            data: 'Car Model',
            name: 'car_modal',
          },
          {
            data: 'Company Name',
            name: 'company_name',
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
            name: (('to_time') && ('createdAt')),
          },
        ],
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
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      $(table.column(idx).header()).append('<span class="sort-icon"/>');
    });
  }

  handleFilterCalendar = () => {
    this.datePicker.overlayVisible = false;
    console.log('this.rangeDates  => ', this.rangeDates);
  }
  handleClearCalendar = () => {
    this.rangeDates = null;
    this.datePicker.overlayVisible = false;
    this.render();
    this.spinner.show();
  }

  ExportRecords() {
    this.service.post('admin/cars/export_report_list', this.exportParam).subscribe(async (res: any) => {
      this.exportData = await res['result']['data'];
      var ExcelData = [];
      this.isExcel = false;
      this.isPDF = false;
      this.exportData.forEach(item => {
        let obj = {
          'Car Brand': item.car_brand,
          'Car Model': item.car_modal,
          'Company Name': item.company_name,
          'Status': item.trip_status,
          'Total Rent': item.booking_rent,
          'From Date': moment(item.from_time).format('LL'),
          'To Date': moment(item.to_time).format('LL'),
        };
        ExcelData.push(obj);
        this.ExcelArray = ExcelData;
      });
    });
  }

  exportAsXLSX() {
    this.isExcel = true;
    this.service.post('admin/cars/export_report_list', this.exportParam).subscribe(async (res: any) => {
      this.exportData = await res['result']['data'];
      var ExcelData = [];
      this.isExcel = false;
      this.isPDF = false;
      this.exportData.forEach(item => {
        let obj = {
          'Car Brand': item.car_brand,
          'Car Model': item.car_modal,
          'Company Name': item.company_name,
          'Status': item.trip_status,
          'Total Rent': item.booking_rent,
          'From Date': moment(item.from_time).format('LL'),
          'To Date': moment(item.to_time).format('LL'),
        };
        ExcelData.push(obj);
        this.ExcelArray = ExcelData;
      });
    });
    // this.ExportRecords();
    setTimeout(() => {
      this.excelService.exportAsExcelFile(this.ExcelArray, 'Car-Report');
    }, 1000);
  }

  public captureScreen() {
    this.isPDF = true;
    this.ExportRecords();
    var pdfdata = document.getElementById('contentToConvert');
    // var pdfdata = $('#ownerDocument').children(".dataTables_scroll")[0];
    html2canvas(pdfdata).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 500;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Car-Report.pdf'); // Generated PDF
    });
  }

}
