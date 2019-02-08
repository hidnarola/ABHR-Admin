import {
  Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit, ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// model
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// primng
import { ConfirmationService, Message } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

// alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

// const google = require('@types/googlemaps');
// import {googlemaps} from '@types/googlemaps';

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
  // model: any = {};
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public emailData: any;
  public nameData: any;
  public title = 'Add Company';
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  users: any;
  private subscription: Subscription;
  checked: boolean;
  message: any;
  msgs: Message[] = [];
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

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
  ) {
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.uniqueNameValidator, this.noWhitespaceValidator])],
      description: ['', Validators.required],
      site_url: ['', Validators.compose([Validators.required,
      Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])],
    });

    this.formData = {
      name: String,
      description: String,
      phone_number: Number,
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
    return isValid ? null : { 'required': true }
  }
  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace1;
    if (isWhitespace1 = (control.value || '').trim().length === 0) {
      return { 'required': true };
    } else {
      const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
      let result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value };
        if (this.isEdit) {
          this.emailData = { 'email': control.value, 'company_id': this.userId };
        }
        return this.service.post('admin/company/checkemail', this.emailData).subscribe(res => {
          if (res['status'] === 'success') {
            this.f.email.setErrors({ 'unique': true });
            return;
          } else {
            this.f.email.setErrors(null);
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
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        setTimeout(() => {
          dataTablesParameters['columns'][4]['isBoolean'] = true;
          this.service.post('admin/company/list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.users = [];
            if (this.users.length > 0) {
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
        }, {
          data: 'Status',
          name: 'is_Active',
          searchable: false
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
    this.userSettings = {
      inputPlaceholderText: 'Enter Address',
      showSearchButton: false,
    };
    this.userSettings = Object.assign({}, this.userSettings);
    console.log('this.userSettings in afterviewinit=> ', this.userSettings);
    // Very Important Line to add after modifying settings.
  }

  // Add-Edit pop up
  open2(content, item) {
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
        this.addressError = false;
      }
    });
    this.submitted = false;
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
  }

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
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
    console.log('on submit usersettings===>', typeof this.placeData);
    console.log('placeData on submit => ', this.placeData);
    if (typeof this.placeData === 'undefined') {
      this.addressError = true;
      console.log(' check here on submit 1=> ');
    } else {
      if (this.placeData.response === false) {
        this.addressError = true;
        console.log(' check here on submit 2=> ');
      } else if (this.placeData.response === true) {
        this.addressError = false;
      }
      console.log(' check here on submit 3=> ');
    }
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.company_address = this.company_address;
      this.formData.service_location = this.service_location;
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
    this.UsersListData();
  }

  autoCompleteCallback1(selectedData: any) {
    console.log(' selectedData in autocomplete => ', selectedData);
    if (selectedData.response) {
      this.placeData = selectedData;
      console.log('this.placeData selectedData => ', this.placeData);
      if (typeof this.placeData === 'undefined') {
        this.addressError = true;
        console.log(' check here  auto complete 1=> ');
      } else {
        if (this.placeData.response === false) {
          this.addressError = true;
          console.log(' check here 2=> ');
        } else if (this.placeData.response === true) {
          this.addressError = false;
        }
        console.log(' check here auto complete 2=> ');
      }
      this.service_location = [];
      var lng = selectedData.data.geometry.location.lng;
      var lat = selectedData.data.geometry.location.lat;
      this.company_address.address = selectedData.data.formatted_address;
      this.service_location.push(lng);
      this.service_location.push(lat);
      for (var i = 0; i < selectedData.data.address_components.length; i++) {
        var addressType = selectedData.data.address_components[i].types[0];
        var addressType = selectedData.data.address_components[i].types[0];
        if (addressType === 'country') {
          var country = selectedData.data.address_components[i].long_name;
          this.company_address.country = country;
        }
        if (addressType === 'administrative_area_level_1') {
          var state = selectedData.data.address_components[i].long_name;
          this.company_address.state = state;
        }
        if (addressType === 'locality') {
          var city = selectedData.data.address_components[i].long_name;
          this.company_address.city = city;
        }
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Current Location not Found' });
    }
  }

  test(address) { }
  onChangeAddress() { }
}
