import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  isCols: boolean;
  public formData: any;
  public isEdit: boolean;
  public isDelete: boolean;
  isLoading: boolean;
  public coupons;
  closeResult: string;
  public title = 'Add Coupon';
  public pageNumber;
  public totalRecords;
  public couponId;
  public idCompanyAdded: Boolean = false;
  public companylist;
  formCoupons: any = {};

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.service.get('admin/coupon/companies').subscribe(res => {
      console.log('res => ', res['data']);
      this.companylist = res['data'];
    });

    this.builtformcontrol();
    this.formData = {
      coupon_code: String,
      discount_rate: Number,
      company_id: String,
      idCompanyAdded: Boolean,

    };
  }

  builtformcontrol() {
    console.log('this.idCompanyAdded => ', this.idCompanyAdded);
    if (this.idCompanyAdded === true) {
      this.AddEditForm = this.formBuilder.group({
        coupon_code: ['', Validators.required],
        discount_rate: ['', Validators.compose([Validators.required, Validators.max(100), Validators.pattern('[0-9]*')])],
        idCompanyAdded: [],
        company_id: ['', Validators.required],
      });
      console.log('if => ');
    } else {
      this.AddEditForm = this.formBuilder.group({
        coupon_code: ['', Validators.required],
        discount_rate: ['', Validators.compose([Validators.required, Validators.max(100), Validators.pattern('[0-9]*')])],
        idCompanyAdded: [],
      });
      console.log('else => ');
    }
  }

  get f() { return this.AddEditForm.controls; }
  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.CouponListData();
  }

  CouponListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[3, 'desc']],
      language: {
        'processing': '',
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/coupon/list', dataTablesParameters).subscribe(async (res: any) => {
            this.coupons = await res['result']['data'];
            console.log('====>', res['result']['data']);
            this.totalRecords = res['result']['recordsTotal'];
            // this.coupons = [];
            if (this.coupons.length > 0) {
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
          data: 'Coupon Code',
          name: 'coupon_code',
        },
        {
          data: 'Discount Rate',
          name: 'discount_rate',
        },
        {
          data: 'Company Name',
          name: 'companyDetails.name',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        },
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // model
  open2(content, item) {
    console.log('this.idCompanyAdded 1 => ', this.idCompanyAdded);
    console.log('item==>', item);
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Coupon';
      this.isEdit = true;
      this.couponId = item._id;
      this.AddEditForm.controls['coupon_code'].setValue(item.coupon_code);
      this.AddEditForm.controls['discount_rate'].setValue(item.discount_rate);
      console.log('car_rental_company_id => ', item.car_rental_company_id);
      if (item.car_rental_company_id !== undefined) {
        this.idCompanyAdded = true;
        this.builtformcontrol();
        this.AddEditForm.controls['coupon_code'].setValue(item.coupon_code);
        this.AddEditForm.controls['discount_rate'].setValue(item.discount_rate);
        console.log('this.idCompanyAdded 2 => ', this.idCompanyAdded);
        this.AddEditForm.controls['company_id'].setValue(item.companyDetails._id);
        console.log('item.companyDetails._id => ', item.companyDetails._id);
      } else {
        this.idCompanyAdded = false;
      }
    } else {
      this.title = 'Add Coupon';
      this.idCompanyAdded = false;
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason === 'Cross click' || reason === 0) {
        this.isEdit = false;
        this.AddEditForm.controls['coupon_code'].setValue('');
        this.AddEditForm.controls['discount_rate'].setValue('');
      }
    });
    this.submitted = false;
  }
  // add-edit popup ends here

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }

  // dlt popup
  delete(couponId) {
    console.log('couponId==>', couponId);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/coupon/delete', { coupon_id: couponId }).subscribe(res => {
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

  onChangeChoiceCompany() {
    console.log('this.AddEditForm===>', this.AddEditForm);
    var obj = {
      coupon_code: [this.AddEditForm.controls.coupon_code.value, Validators.required],
      discount_rate: [this.AddEditForm.controls.discount_rate.value, Validators.compose([Validators.required,
      Validators.pattern('[0-9]*')])],
      idCompanyAdded: [this.idCompanyAdded],
    };
    if (this.idCompanyAdded === true) {
      obj = Object.assign(obj, { company_id: ['', Validators.required] });
    } else {
      if (obj.hasOwnProperty('company_id')) {
        delete obj['company_id'];
      }
    }
    this.AddEditForm = this.formBuilder.group(obj);
  }
  onSubmit() {
    this.submitted = true;
    console.log('this.formdata => ', this.formData);
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.idCompanyAdded = this.idCompanyAdded;
      console.log('this.formData => ', this.formData);
      console.log('idCompanyAdded => ', this.idCompanyAdded);
      console.log('/* => ', this.AddEditForm.value);
      if (this.isEdit) {
        this.formData.coupon_id = this.couponId;
        this.title = 'Edit Coupon';
        console.log('couponId', this.couponId);
        this.service.put('admin/coupon/update', this.formData).subscribe(res => {
          this.isLoading = false;
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      } else {
        this.title = 'Add Coupon';
        this.service.post('admin/coupon/add', this.formData).subscribe(res => {
          this.isLoading = false;
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.isLoading = false;
          console.log('err => ', err);
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      }
      this.isEdit = false;
      this.submitted = false;
      this.idCompanyAdded = false;
    } else {
      console.log(' here invalid= > ');
      return;
    }
  }

}
