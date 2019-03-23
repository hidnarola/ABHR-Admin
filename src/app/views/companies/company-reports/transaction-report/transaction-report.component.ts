import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ExcelService } from '../../../../shared/services/excel.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css']
})
export class TransactionReportComponent implements OnInit, AfterViewInit, OnDestroy {

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
  isCols: boolean;
  public pageNumber;
  public totalRecords;
  public companyId;
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
        destroy: true,
        processing: true,
        serverSide: true,
        ordering: true,
        order: [[5, 'desc']],
        language: { 'processing': '' },
        responsive: true,
        // scrollX: true,
        // scrollCollapse: true,
        autoWidth: false,
        initComplete: function (settings, json) {
          $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
        },

        ajax: (dataTablesParameters: any, callback) => {
          this.pageNumber = dataTablesParameters.length;
          dataTablesParameters['company_id'] = this.companyId;
          this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          this.exportParam = dataTablesParameters;
          setTimeout(() => {
            if (this.rangeDates) {
              if (this.rangeDates[1]) {
                dataTablesParameters['selectFromDate'] = moment(this.rangeDates[0]).format('L');
                dataTablesParameters['selectToDate'] = moment(this.rangeDates[1]).format('L');
                this.datePicker.overlayVisible = false;
              }
            }
            this.service.post('company/transaction/report_list', dataTablesParameters).subscribe(res => {
              this.reports = res['result']['data'];
              this.totalRecords = res['result']['recordsTotal'];
              // this.reports = [];
              if (this.reports.length > 0) {
                this.isCols = true;
                $('.dataTables_wrapper').css('display', 'block');
              } else if (this.reports.length === 0 && this.rangeDates === undefined) {
                console.log('new condition => ');
                this.isCols = false;
              } else {
                if (dataTablesParameters['search']['value'] !== '' && dataTablesParameters['search']['value'] !== null ||
                  ((dataTablesParameters['selectFromDate'] && dataTablesParameters['selectToDate']) !== '') &&
                  ((dataTablesParameters['selectFromDate'] && dataTablesParameters['selectToDate']) !== null)) {
                  this.isCols = true;
                } else if (this.rangeDates) {
                  this.isCols = true;
                } else {
                  this.isCols = false;
                }
                // this.isCols = false;
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
            data: 'First Name',
            name: 'first_name',
          },
          {
            data: 'Last Name',
            name: 'last_name',
          },
          // {
          //   data: 'Company Name',
          //   name: 'company_name',
          // },
          {
            data: 'Status',
            name: 'transaction_status',
          },
          {
            data: 'Transaction Amount',
            name: 'total_booking_amount',
          },
          {
            data: 'From Date',
            name: 'from_time',
          },
          {
            data: 'To Date',
            name: (('to_time') && ('createdAt')),
          },
        ]
      };
    } catch (error) { }

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
  }
  handleClearCalendar = () => {
    this.rangeDates = null;
    this.datePicker.overlayVisible = false;
    this.render();
    this.spinner.show();
  }
  ExportRecords() {
    this.service.post('company/transaction/export_report_list', this.exportParam).subscribe(async (res: any) => {
      this.exportData = await res['result']['data'];
      var ExcelData = [];
      this.isExcel = false;
      this.isPDF = false;
      this.exportData.forEach(item => {
        let obj = {
          'First Name': item.first_name,
          'Last Name': item.last_name,
          // 'Company_Name': item.company_name,
          'Status': item.transaction_status,
          'Transaction Amount': item.total_booking_amount,
          'From Date': moment(item.from_time).format('LL'),
          'To Date': moment(item.to_time).format('LL'),
        };
        ExcelData.push(obj);
        this.ExcelArray = ExcelData;
      });
    });
  }

  exportAsXLSX(): void {
    this.isExcel = true;
    this.service.post('company/transaction/export_report_list', this.exportParam).subscribe(async (res: any) => {
      this.exportData = await res['result']['data'];
      var ExcelData = [];
      this.isExcel = false;
      this.isPDF = false;
      this.exportData.forEach(item => {
        let obj = {
          'First Name': item.first_name,
          'Last Name': item.last_name,
          // 'Company_Name': item.company_name,
          'Status': item.transaction_status,
          'Transaction Amount': item.total_booking_amount,
          'From Date': moment(item.from_time).format('LL'),
          'To Date': moment(item.to_time).format('LL'),
        };
        ExcelData.push(obj);
        this.ExcelArray = ExcelData;
      });
    });
    setTimeout(() => {
      this.excelService.exportAsExcelFile(this.ExcelArray, 'Transaction-Report');
    }, 1000);
  }

  public captureScreen() {
    this.isPDF = true;
    this.ExportRecords();
    var pdfdata = document.getElementById('contentToConvert');
    // var pdfdata = $('#contentToConvert_wrapper').children(".dataTables_scroll")[0];
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
      pdf.save('Transaction-report.pdf'); // Generated PDF   
    });
  }
}
