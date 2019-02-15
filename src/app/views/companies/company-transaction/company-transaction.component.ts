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
  selector: 'app-company-transaction',
  templateUrl: './company-transaction.component.html',
  styleUrls: ['./company-transaction.component.css']
})
export class CompanyTransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  hideSpinner: boolean;
  public pageNumber;
  public totalRecords;
  public transaction;
  isCols: boolean;
  public companyId;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    console.log('companyid in car reports==>', this.companyId);
  }

  ngOnInit() {
    this.TransactionData();
  }

  TransactionData() {
    console.log('this.hideSpinner => ', this.hideSpinner);
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[8, 'desc']],
      language: {
        'processing': '',
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][0]['isNumber'] = true;
        dataTablesParameters['columns'][1]['isNumber'] = true;
        dataTablesParameters['columns'][4]['isNumber'] = true;
        dataTablesParameters['columns'][5]['isNumber'] = true;
        dataTablesParameters['company_id'] = this.companyId;
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('company/transaction/list', dataTablesParameters).subscribe(res => {
            console.log('res in trasaction=> ', res);
            this.transaction = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.transaction = [];
            if (this.transaction.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            console.log('total records===>', this.totalRecords);
            console.log('page number', this.pageNumber);
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
          data: 'Booking Number',
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
        {
          data: 'Coupon Code',
          name: 'coupon_code',
        },
        {
          data: 'Coupon Rate',
          name: 'coupon_rate',
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
      // this.dtOptions = {
      //   language: {
      //     processing: '<i class= "fa fa-refresh loader fa-spin"></i>'
      //   }
      // };
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cancel(Id) {
    var date = moment().format('YYYY-MM-DD');
    console.log('userId==>', Id);
    this.confirmationService.confirm({
      message: 'Are you sure want to cancel this Transaction?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var Obj = {
          'booking_number': Id,
          'cancel_date': date
        };
        this.service.put('admin/transaction/edit', Obj).subscribe(res => {
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
