import {
  Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit, ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { cc } from '../../../../shared/constant/country_code';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElementcar: DataTableDirective;
  dtElementrental: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public index;
  public viewData;
  public userId;
  public userDetails;
  public carData;
  public rentalData;
  isCols: boolean;
  message: any;
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public isEdit;
  closeResult: string;
  public title = 'Add Company';
  isLoading: boolean;
  public numberErr: boolean = false;
  public searchElementRef: ElementRef;
  public header;
  public emailData: any;
  public phoneData: any;
  public nameData: any;
  userSettings: any = {};
  public company_address: any;
  public service_location = [];
  public pageNumber;
  public totalRecords;
  public countryCode: SelectItem[];
  selectedCc: string;
  public emailErrMsg;
  public phoneErrMsg;
  public modalData;

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
    this.countryCode = cc;
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
        this.emailData = { 'email': control.value ? control.value.trim() : '', 'company_id': this.userId };
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
        this.phoneData = { 'phone_number': control.value ? control.value.trim() : '', 'company_id': this.userId };
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
  onSubmit() {
    this.submitted = true;
    this.numberErr = false;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.name = this.formData.name.trim();
      this.formData.description = this.formData.description.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      this.formData.company_id = this.userId;
      this.formData.company_address = this.company_address;
      this.formData.service_location = this.service_location;
      if (this.formData.phone_number === null || this.formData.phone_number === '' || this.formData.phone_number === 'null') {
        this.formData.country_code = null;
        console.log('number null => ');
      }
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
      console.log('res[] => ', res['data']);
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
    this.modalData = content;
    console.log('userDetails => ', userDetails);
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
    this.AddEditForm.controls['country_code'].setValue(userDetails.country_code);
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
    this.submitted = false;
    this.numberErr = false;
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
    console.log('this.modalData on destroy => ', this.modalData);
    if (this.modalData !== undefined) {
      this.closePopup();
    }
    this.closeDeletePopup();
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
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 5) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
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
      // order: [[4, 'desc']],
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
          dataTablesParameters.company_id = this.userId;
          this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
            this.carData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.carData = [];
            if (this.carData.length > 0) {
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


  ngOnInit() {
    this.isCols = true;
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
