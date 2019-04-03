import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  public users;
  public companyId;
  private subscription: Subscription;
  message: any;
  msgs: Message[] = [];
  closeResult: string;
  isCols: boolean;
  public pageNumber;
  public totalRecords;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    console.log('company => ', company);
    this.companyId = company._id;
  }

  UsersListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[5, 'desc']],
      language: { 'processing': '' },
      responsive: true,
      destroy: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        dataTablesParameters['columns'][3]['isNumber'] = true;
        dataTablesParameters['columns'][4]['isBoolean'] = true;
        setTimeout(() => {
          dataTablesParameters.company_id = this.companyId;
          this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.users = []
            if (this.users.length > 0) {
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
          data: 'Car Brand',
          name: 'brand_name',
        },
        {
          data: 'Car Model',
          name: 'model_name',
        },
        // {
        //   data: 'Car Class',
        //   name: 'car_class',
        // },
        // {
        //   data: 'Transmission',
        //   name: 'brandDetails.transmission',
        // },
        {
          data: 'Purchased Year',
          name: 'age_of_car',
        },
        {
          data: 'Price',
          name: 'rent_price',
        },
        {
          data: 'Available',
          name: 'is_available',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 5) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
      // if (idx !== 4) {
      //   $(table.column(idx).header()).append('<span class="sort-icon"/>');
      // }
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

  // dlt popup
  delete(userId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/company/car/delete', { car_id: userId }).subscribe(res => {
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
  // dlt pop up ends here

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  closePopup() {
    const element = document.getElementById('closepopup');
    if (element !== null) {
      element.click();
    }
  }

  onSubmit() { }

  ngOnInit() {
    this.isCols = true;
    this.UsersListData();
  }

}
