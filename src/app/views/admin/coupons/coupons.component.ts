import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  public numberErr: boolean = false;
  public rateError: boolean = false;
  CarImageRAW: any = [];
  CarImage: any = [];
  imgUrl = environment.imgUrl;
  public old_image;
  public nameData: any;
  public couponImage;

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
      this.companylist = res['data'];
    });

    this.builtformcontrol();
    this.formData = {
      coupon_code: String,
      discount_rate: Number,
      company_id: String,
      idCompanyAdded: Boolean,
      description: String,
      banner_image: FileList,
    };
  }

  builtformcontrol() {
    if (this.idCompanyAdded === true) {
      this.AddEditForm = this.formBuilder.group({
        coupon_code: ['', Validators.compose([Validators.required, this.noWhitespaceValidator, this.uniqueNameValidator])],
        discount_rate: ['', Validators.compose([Validators.required, Validators.max(99.99),
        Validators.pattern('^[0-9][0-9]*(\.[0-9]+)?$')])],
        idCompanyAdded: [this.idCompanyAdded],
        company_id: ['', Validators.required],
        description: ['', Validators.required],
        banner_image: [null]
      });
    } else {
      this.AddEditForm = this.formBuilder.group({
        coupon_code: ['', Validators.compose([Validators.required, this.noWhitespaceValidator, this.uniqueNameValidator])],
        discount_rate: ['', Validators.compose([Validators.required, Validators.max(99.99),
        Validators.pattern('^[0-9][0-9]*(\.[0-9]+)?$')])],
        idCompanyAdded: [this.idCompanyAdded],
        description: ['', Validators.required],
        banner_image: [null]
      });
    }
  }

  public uniqueNameValidator = (control: FormControl) => {
    let isWhitespace2;
    if ((isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      this.nameData = { 'coupon_code': control.value };
      if (this.isEdit) {
        this.nameData = { 'coupon_code': control.value, 'coupon_id': this.couponId };
      }
      return this.service.post('admin/coupon/check_coupon', this.nameData).subscribe(res => {
        if (res['status'] === 'success') {
          this.f.coupon_code.setErrors({ 'uniqueName': true });
          return;
        } else {
          this.f.coupon_code.setErrors(null);
        }
      });
    }
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
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
    this.isCols = true;
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
      order: [[5, 'desc']],
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
        dataTablesParameters['columns'][2]['isNumber'] = true;
        dataTablesParameters['columns'][4]['isBoolean'] = true;
        setTimeout(() => {
          this.service.post('admin/coupon/list', dataTablesParameters).subscribe(async (res: any) => {
            this.coupons = await res['result']['data'];
            // this.coupons = [];
            this.totalRecords = res['result']['recordsTotal'];
            console.log('res====>', this.coupons);
            if (this.coupons.length > 0) {
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
          data: 'Banner',
          name: 'banner_image',
        },
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
          data: 'Company Name',
          name: 'isDisplay',
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
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 5) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  // model
  open2(content, item) {
    this.formData.banner_image = null;
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Coupon';
      this.isEdit = true;
      this.couponId = item._id;
      this.AddEditForm.controls['coupon_code'].setValue(item.coupon_code);
      this.AddEditForm.controls['discount_rate'].setValue(item.discount_rate);
      this.AddEditForm.controls['description'].setValue(item.description);
      this.old_image = item.banner ? item.banner : null;
      if (item.companyDetails !== undefined) {
        this.idCompanyAdded = true;
        this.builtformcontrol();
        this.AddEditForm.controls['coupon_code'].setValue(item.coupon_code);
        this.AddEditForm.controls['discount_rate'].setValue(item.discount_rate);
        this.AddEditForm.controls['description'].setValue(item.description);
        this.old_image = item.banner ? item.banner : null;
        this.AddEditForm.controls['company_id'].setValue(item.companyDetails._id);
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
        this.AddEditForm.controls['description'].setValue('');
        this.AddEditForm.controls['banner_image'].setValue(null);
      }
    });
    this.submitted = false;
    this.numberErr = false;
    this.rateError = false;
  }
  // add-edit popup ends here

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }

  // dlt popup
  delete(couponId, banner) {
    console.log('banner => ', banner);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var Obj = {
          coupon_id: couponId,
          banner: banner
        };
        this.service.put('admin/coupon/delete', Obj).subscribe(res => {
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
    console.log('this.AddEditForm on checkbox => ', this.AddEditForm);
    var obj = {
      coupon_code: [this.AddEditForm.controls.coupon_code.value, Validators.compose([Validators.required,
      this.noWhitespaceValidator, this.uniqueNameValidator])],
      discount_rate: [this.AddEditForm.controls.discount_rate.value, Validators.compose([Validators.required, Validators.max(99.99),
      Validators.pattern('^[0-9][0-9]*(\.[0-9]+)?$')])],
      description: [this.AddEditForm.controls.description.value, Validators.required],
      banner_image: [this.AddEditForm.controls.banner_image.value],
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
    console.log('this.AddEditForm after obj => ', this.AddEditForm);
  }

  handleFileInput(event) {
    this.f.banner_image.setErrors({ 'fileformat': false });
    let isValid = false;
    const files = event.target.files;
    this.formData.banner_image = event.target.files;
    console.log('this.formData.banner_image fileinput event => ', this.formData.banner_image);
    if (files) {
      for (const file of files) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          let fr = new FileReader();
          fr.onload = (e: any) => { // when file has loaded
            var img = new Image();
            img.src = e.target.result;
            console.log('imageee=>', img);
            img.onload = () => {
              var width = img.width;
              var height = img.height;
              console.log('width====>', width, 'height====>', height);
              if (width === height) {
                this.f.banner_image.setErrors(null);
                return;
              } else {
                this.f.banner_image.setErrors({ 'squareimage': true });
                return;
              }
            };
          };
          fr.readAsDataURL(file);
        } else {
          this.f.banner_image.setErrors({ 'fileformat': true });
          return;
        }
      }
    }
  }


  onSubmit() {
    this.submitted = true;
    this.numberErr = false;
    this.rateError = false;
    console.log('this.AddEditForm in submit => ', this.AddEditForm);
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      console.log('formvalues=====>, ', this.AddEditForm.value);
      const headers = new HttpHeaders();
      // this is the important step. You need to set content type as null
      headers.set('Content-Type', null);
      headers.set('Accept', 'multipart/form-data');
      const formData = new FormData();
      formData.append('coupon_code', this.f.coupon_code.value);
      formData.append('description', this.f.description.value);
      formData.append('discount_rate', this.f.discount_rate.value);
      if (this.formData['banner_image'] instanceof Object && typeof this.formData['banner_image'] !== 'undefined') {
        formData.append('banner_image', this.formData['banner_image'][0]);
      }
      if (this.f.idCompanyAdded.value === null) {
        formData.append('idCompanyAdded', 'false');
      } else {
        formData.append('idCompanyAdded', this.f.idCompanyAdded.value);
        if (this.f.idCompanyAdded.value === true) {
          formData.append('company_id', this.f.company_id.value);
        }
      }
      if (this.isEdit) {
        formData.append('old_banner_image', this.old_image);
        formData.append('coupon_id', this.couponId);
        this.title = 'Edit Coupon';
        this.service.post('admin/coupon/update', formData, headers).subscribe(res => {
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
        console.log('inadd=====>');
        console.log('formData => ', formData);
        this.title = 'Add Coupon';
        this.service.post('admin/coupon/add', formData, headers).subscribe(res => {
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
      }
      this.isEdit = false;
      this.submitted = false;
      this.idCompanyAdded = false;
      this.AddEditForm.controls['idCompanyAdded'].setValue('');
      console.log('this.AddEditForm after submit => ', this.AddEditForm);
    } else {
      this.isLoading = false;
      return;
    }
  }

  restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  keyup(event) {
    if (this.AddEditForm.controls.discount_rate.value !== '' && this.AddEditForm.controls.discount_rate.value !== null) {
      var inputValue = !isNaN(parseFloat(this.AddEditForm.controls.discount_rate.value)) &&
        isFinite(this.AddEditForm.controls.discount_rate.value);
      if (inputValue === false) {
        this.numberErr = true;
      } else {
        if (this.AddEditForm.controls.discount_rate.value > 99.99) {
          this.rateError = true;
        } else {
          this.rateError = false;
        }
      }
    } else {
      this.numberErr = false;
      this.rateError = false;
    }
    if (this.submitted === true) {
      this.numberErr = false;
    }
  }

  handleChange(e, id) {
    const params = {
      coupon_id: id,
      status: e.checked
    };
    this.service.post('admin/coupon/change_status', params)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status change succesfully' });
      }, error => {
        e.checked = !e.checked;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      });
  }

}
