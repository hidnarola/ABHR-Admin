import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  hideSpinner: boolean;
  public pageNumber;
  public totalRecords;
  public transaction;
  isCols: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.isCols = true;
    this.TransactionData();
  }

  TransactionData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[9, 'desc']],
      language: {
        'processing': '',
      },
      destroy: true,
      // scrollX: true,
      // scrollCollapse: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][1]['isNumber'] = true;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        dataTablesParameters['columns'][5]['isNumber'] = true;
        dataTablesParameters['columns'][6]['isNumber'] = true;
        setTimeout(() => {
          this.service.post('admin/transaction/list', dataTablesParameters).subscribe(res => {
            this.transaction = res['result']['data'];
            console.log('this.transaction  => ', this.transaction);
            this.totalRecords = res['result']['recordsTotal'];
            // this.transaction = [];
            if (this.transaction.length > 0) {
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
          data: 'Company Name',
          name: 'company_name',
        },
        {
          data: 'Booking ID',
          name: 'booking_number',
        },
        {
          data: 'Deposit Amount',
          name: 'deposite_amount',
        },
        {
          data: 'Status',
          name: 'transaction_status',
        },
        // {
        //   data: 'Coupon Code',
        //   name: 'coupon_code',
        // },
        {
          data: 'Coupon Rate',
          name: 'coupon_percentage',
        },
        {
          data: 'Total Amount',
          name: 'total_booking_amount',
        },
        {
          data: 'VAT',
          name: 'vat',
        },
        {
          data: 'From Time',
          name: 'from_time',
        },
        {
          data: 'To Time',
          name: 'to_time',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        },
      ]
    };
  }

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 9) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.closeDeletePopup();
  }

  closeDeletePopup() {
    const data: HTMLCollection = document.getElementsByClassName('ui-button');
    if (data.length > 0) {
      console.log('l => ', data[1]);
      const ele: any = data[1];
      ele.click();
    }
  }

  cancel(Id) {
    var date = moment().format('YYYY-MM-DD');
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this Transaction?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var Obj = {
          'booking_number': Id,
          'cancel_date': date
        };
        this.service.post('app/car/cancel-booking-v2', Obj).subscribe(res => {
          this.render();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      },
      reject: () => {
      }
    });
  }

}
