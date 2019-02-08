import {
  Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit, ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

// model
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// popup-forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// alert
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  public index;
  public viewData;
  public userId;
  public userDetails;
  public carData;
  public rentalData;
  isCols: boolean;

  private subscription: Subscription;
  message: any;
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public isEdit;
  closeResult: string;
  public title = 'Add Company';
  isLoading: boolean;

  @ViewChild(DataTableDirective)
  dtElementcar: DataTableDirective;
  dtElementrental: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public searchElementRef: ElementRef;
  public header;
  public emailData: any;
  public nameData: any;
  userSettings: any = {};
  public company_address: any;
  public service_location = []; // [<longitude>, <latitude>]
  public pageNumber;
  public totalRecords;
  constructor(
    public renderer: Renderer,
    private route: ActivatedRoute,
    private service: CrudService,
    private modalService: NgbModal,
    public router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) {
    console.log('this.route.snapshot.paramMap in detail page=> ', this.route.snapshot.paramMap);
    if (this.route.snapshot.paramMap.has('id') && this.route.snapshot.paramMap.get('id') !== ':id' &&
      this.route.snapshot.paramMap.get('id') !== ':_id') {
      this.route.params.subscribe(params => {
        this.userId = params.id;
        localStorage.setItem('companyId', this.userId);
      });
    } else {
      this.userId = localStorage.getItem('companyId');
      this.router.navigate(['/admin/car-rental-companies/view/' + this.userId]);
    }
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
        this.emailData = { 'email': control.value, 'company_id': this.userId };
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
      this.nameData = { 'name': control.value, 'company_id': this.userId };
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
  // add-edit-popup form validation
  get f() { return this.AddEditForm.controls; }
  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      const formData: FormData = new FormData();
      this.formData = this.AddEditForm.value;
      this.formData.company_id = this.userId;
      this.formData.company_address = this.company_address;
      this.formData.service_location = this.service_location;
      this.service.put('admin/company/update', this.formData).subscribe(res => {
        this.userDetails = this.formData;
        this.isLoading = true;
        this.closePopup();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        this.closePopup();
      });
      this.submitted = false;
    }
  }

  UserDetails() {
    this.service.get('admin/company/details/' + this.userId).subscribe(res => {
      if (res['data'] !== null) {
        this.userDetails = res['data'];
      } else {
        this.router.navigate(['/admin/car-rental-companies']);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No Record Found' });
      }
    });
  }

  // model
  open2(content, userDetails) {
    this.isLoading = false;
    this.service_location = [];
    this.userSettings.inputPlaceholderText = userDetails.company_address.address;
    this.service_location = userDetails.service_location;
    this.company_address = userDetails.company_address;
    this.AddEditForm.controls['name'].setValue(userDetails.name);
    this.AddEditForm.controls['description'].setValue(userDetails.description);
    this.AddEditForm.controls['email'].setValue(userDetails.email);
    this.AddEditForm.controls['site_url'].setValue(userDetails.site_url);
    this.AddEditForm.controls['phone_number'].setValue(userDetails.phone_number);
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }

  // add-edit popup ends here

  render(): void {
    this.dtElementcar.dtInstance.then((dtInstance: DataTables.Api) => {
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
    this.userSettings = {
      inputPlaceholderText: 'Enter Address',
      showSearchButton: false,
    };
    this.userSettings = Object.assign({}, this.userSettings);
    // Very Important Line to add after modifying settings.
  }

  CarData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[5, 'desc']],
      language: { 'processing': '<i class=\'fa fa-refresh loader fa-spin\'></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        dataTablesParameters['columns'][3]['isNumber'] = true;
        dataTablesParameters['columns'][4]['isBoolean'] = true;
        setTimeout(() => {
          dataTablesParameters.company_id = this.userId;
          this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
            this.carData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.carData = [];
            if (this.carData.length > 0) {
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
          data: 'Car Brand',
          name: 'brandDetails.brand_name',
        },
        {
          data: 'Car Model',
          name: 'modelDetails.model_name',
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
          data: 'Release Year',
          name: 'modelDetails.release_year',
        },
        {
          data: 'Price',
          name: 'rent_price',
        },
        {
          data: 'Available',
          name: 'is_avialable',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        }
      ]
    };
  }


  ngOnInit() {
    this.CarData();
    this.UserDetails();
  }

  autoCompleteCallback1(selectedData: any) {
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
  }

  test(address) { }

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

}
