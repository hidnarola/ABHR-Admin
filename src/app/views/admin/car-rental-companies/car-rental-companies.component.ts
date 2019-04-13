import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit, ElementRef, } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { cc } from '../../../shared/constant/country_code';

@Component({
  selector: 'app-car-rental-companies',
  templateUrl: './car-rental-companies.component.html',
  styleUrls: ['./car-rental-companies.component.css']
})
export class CarRentalCompaniesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public searchElementRef: ElementRef;
  public header;
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public emailData: any;
  public phoneData: any;
  public nameData: any;
  public title = 'Add Company';
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  users: any;
  checked: boolean;
  message: any;
  closeResult: string;
  isLoading: boolean;
  userSettings: any = {};
  public company_address: any;
  public service_location = []; // [<longitude>, <latitude>]
  isCols: boolean;
  public pageNumber;
  public totalRecords;
  public placeData: any;
  public addressError: boolean = false;
  public emailErrMsg;
  public phoneErrMsg;
  public numberErr: boolean = false;
  selectedCc: string;
  public countryCode: SelectItem[];
  public modalData;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) {
    this.countryCode = cc;
    // addform validation
    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.AddEditForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.uniqueNameValidator, this.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      site_url: ['', Validators.compose([Validators.required,
      Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      phone_number: ['', Validators.compose([Validators.pattern('^[0-9]{10,20}$'), this.uniquePhoneValidator])],
      country_code: [''],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])],
    });

    this.formData = {
      name: String,
      description: String,
      phone_number: Number,
      country_code: Number,
      email: String,
      site_url: String
    };

    this.company_address = {
      country: String,
      state: String,
      city: String,
      address: String
    };
  }
  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace1;
    if (isWhitespace1 = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
      let result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value ? control.value.trim() : '' };
        if (this.isEdit) {
          this.emailData = { 'email': control.value ? control.value.trim() : '', 'company_id': this.userId };
        }
        return this.service.post('admin/company/checkemail', this.emailData).subscribe(res => {
          if (res['status'] === 'success') {
            this.emailErrMsg = res['message'];
            this.f.email.setErrors({ 'unique': true });
            return;
          } else {
            this.f.email.setErrors(null);
          }
        });
      }
    }
  }

  public uniquePhoneValidator = (control: FormControl) => {
    let isWhitespacePhone;
    if (isWhitespacePhone = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^[0-9]{10,20}$');
      let result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.phoneData = { 'phone_number': control.value ? control.value.trim() : '' };
        if (this.isEdit) {
          this.phoneData = { 'phone_number': control.value ? control.value.trim() : '', 'company_id': this.userId };
        }
        return this.service.post('admin/company/checkphone', this.phoneData).subscribe(res => {
          console.log('res-status => ', res['status']);
          console.log('res => ', res);
          if (res['status'] === 'success') {
            this.phoneErrMsg = res['message'];
            console.log('this.phoneErrMsg => ', this.phoneErrMsg);
            this.f.phone_number.setErrors({ 'unique': true });
            return;
          } else {
            this.f.phone_number.setErrors(null);
          }
        });
      }
    }
  }


  public uniqueNameValidator = (control: FormControl) => {
    let isWhitespace2;
    if ((isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      this.nameData = { 'name': control.value };
      if (this.isEdit) {
        this.nameData = { 'name': control.value, 'company_id': this.userId };
      }
      return this.service.post('admin/company/checkname', this.nameData).subscribe(res => {
        if (res['status'] === 'success') {
          this.f.name.setErrors({ 'uniqueName': true });
          return;
        } else {
          this.f.name.setErrors(null);
        }
      });
    }
  }

  get f() { return this.AddEditForm.controls; }
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
      // scrollX: true,
      // scrollCollapse: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        setTimeout(() => {
          dataTablesParameters['columns'][4]['isBoolean'] = true;
          this.service.post('admin/company/list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            // this.users = [];
            this.totalRecords = res['result']['recordsTotal'];
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
          data: 'Company Name',
          name: 'name',
        },
        {
          data: 'Email',
          name: 'email',
        },
        {
          data: 'Site URl',
          name: 'site_url',
        },
        {
          data: 'Phone Number',
          name: 'phone_number',
        },
        {
          data: 'Status',
          name: 'is_Active',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false,
          searchable: false
        }
      ]
    };
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.userSettings = {
      inputPlaceholderText: 'Enter Address',
      showSearchButton: false,
    };
    this.userSettings = Object.assign({}, this.userSettings);
    // Very Important Line to add after modifying settings.

    let table: any = $('.custom-datatable').DataTable();
    const noSpanIndex = [5];
    table.columns().iterator('column', function (ctx, idx) {
      if (noSpanIndex.indexOf(idx) < 0) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  // Add-Edit pop up
  open2(content, item) {
    this.modalData = content;
    console.log('item => ', item);
    console.log('item.country_code => ', item.country_code);
    this.service_location = [];
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Company';
      this.isEdit = true;
      this.userId = item._id;
      this.userSettings.inputPlaceholderText = item.company_address.address;
      var addressObj = { response: true, data: item.company_address.address };
      this.placeData = addressObj;
      this.service_location = item.service_location;
      this.company_address = item.company_address;
      this.AddEditForm.controls['name'].setValue(item.name);
      this.AddEditForm.controls['description'].setValue(item.description);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['site_url'].setValue(item.site_url);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
      this.AddEditForm.controls['country_code'].setValue(item.country_code);
    } else {
      this.title = 'Add Company';
      this.userSettings.inputPlaceholderText = 'Enter Address';
      if (typeof this.placeData !== 'undefined') {
        this.placeData.response = false;
      }
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
        this.AddEditForm.controls['name'].setValue('');
        this.AddEditForm.controls['description'].setValue('');
        this.AddEditForm.controls['email'].setValue('');
        this.AddEditForm.controls['site_url'].setValue('');
        this.AddEditForm.controls['phone_number'].setValue('');
        this.AddEditForm.controls['country_code'].setValue('971');
        this.addressError = false;
      }
    });
    this.submitted = false;
    this.numberErr = false;
  }
  // add-edit popup ends here

  // dlt popup
  delete(userId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/company/delete', { company_id: userId }).subscribe(res => {
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    console.log('this.modalData on destroy => ', this.modalData);
    if (this.modalData !== undefined) {
      this.closePopup();
    }
    this.closeDeletePopup();
  }

  closePopup() {
    const element = document.getElementById('closepopup');
    if (element !== null) {
      element.click();
    }
    this.isLoading = false;
  }

  closeDeletePopup() {
    const data: HTMLCollection = document.getElementsByClassName('ui-button');
    if (data.length > 0) {
      console.log('l => ', data[1]);
      const ele: any = data[1];
      ele.click();
    }
  }

  handleChange(e, id) {
    const params = {
      company_id: id,
      status: e.checked
    };
    this.service.post('admin/company/change_status', params)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status change succesfully' });
      }, error => {
        e.checked = !e.checked;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      });
  }

  onSubmit() {
    this.submitted = true;
    this.numberErr = false;
    if (typeof this.placeData === 'undefined') {
      this.addressError = true;
    } else {
      if (this.placeData.response === false) {
        this.addressError = true;
      } else if (this.placeData.response === true) {
        this.addressError = false;
      }
    }
    console.log('this.company_address => ', this.company_address);
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.name = this.formData.name.trim();
      this.formData.description = this.formData.description.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      this.formData.company_address = this.company_address;
      this.formData.service_location = this.service_location;
      if (this.formData.phone_number === null || this.formData.phone_number === '' || this.formData.phone_number === 'null') {
        this.formData.country_code = null;
      }
      console.log('this.formData => ', this.formData);
      if (this.isEdit) {
        this.formData.company_id = this.userId;
        this.title = 'Edit Company';
        this.service.put('admin/company/update', this.formData).subscribe(res => {
          this.isLoading = true;
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
        this.title = 'Add Company';
        this.service.post('admin/company/add', this.formData).subscribe(res => {
          this.isLoading = true;
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
      this.placeData = [];
    } else {
      return;
    }
  }

  ngOnInit() {
    this.isCols = true;
    this.UsersListData();
  }

  autoCompleteCallback1(selectedData: any) {
    if (selectedData.response) {
      this.placeData = selectedData;
      if (typeof this.placeData === 'undefined') {
        this.addressError = true;
      } else {
        if (this.placeData.response === false) {
          this.addressError = true;
        } else if (this.placeData.response === true) {
          this.addressError = false;
        }
      }
      this.service_location = [];
      var lng = selectedData.data.geometry.location.lng;
      var lat = selectedData.data.geometry.location.lat;
      this.company_address.address = selectedData.data.formatted_address;
      this.service_location.push(lng);
      this.service_location.push(lat);
      var countryFlag = 0;
      var cityFlag = 0;
      var stateFlag = 0;
      for (var i = 0; i < selectedData.data.address_components.length; i++) {
        var addressType = selectedData.data.address_components[i].types[0];
        if (addressType === 'country') {
          var country = selectedData.data.address_components[i].long_name;
          this.company_address.country = country;
          countryFlag = 1;
        }
        if (addressType === 'administrative_area_level_1') {
          var state = selectedData.data.address_components[i].long_name;
          this.company_address.state = state;
          stateFlag = 1;
        }
        if (addressType === 'locality') {
          var city = selectedData.data.address_components[i].long_name;
          this.company_address.city = city;
          cityFlag = 1;
        }
        if (countryFlag === 0) {
          this.company_address.country = '';
        }
        if (cityFlag === 0) {
          this.company_address.city = '';
        }
        if (stateFlag === 0) {
          this.company_address.state = '';
        }
      }
    } else {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Current Location not Found' });
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
    if (this.AddEditForm.controls.phone_number.status === 'INVALID') {
      if (this.AddEditForm.controls.phone_number.value.length < 21) {
        this.numberErr = false;
      } else {
        this.numberErr = true;
      }
    } else {
      this.numberErr = false;
    }
    if (this.submitted === true) {
      this.numberErr = false;
    }
  }

}
