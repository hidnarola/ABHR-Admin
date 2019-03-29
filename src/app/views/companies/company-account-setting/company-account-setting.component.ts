import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DataSharingService, AdminUser, CompanyUser } from '../../../shared/services/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { cc } from '../../../shared/constant/country_code';

@Component({
  selector: 'app-company-account-setting',
  templateUrl: './company-account-setting.component.html',
  styleUrls: ['./company-account-setting.component.css']
})
export class CompanyAccountSettingComponent implements OnInit, AfterViewInit {

  public companyU: CompanyUser;
  public adminU: AdminUser;
  public SettingForm;
  submitted = false;
  public formData: any;
  public Id;
  public companyUser;
  isLoading: boolean;
  public UserDetails;
  public emailData: any;
  public phoneData: any;
  public nameData: any;
  public companyId;
  public errMsg;
  public phoneErrMsg;
  public numberErr: boolean = false;
  public company_address: any;
  userSettings: any = {};
  public placeData: any;
  public service_location = []; // [<longitude>, <latitude>]
  public addressError: boolean = false;
  public countryCode: SelectItem[];
  selectedCc: string;

  constructor(
    private formBuilder: FormBuilder,
    private service: CrudService,
    private router: Router,
    private messageService: MessageService,
    private datashare: DataSharingService,
    private spinner: NgxSpinnerService
  ) {
    this.countryCode = cc;
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;

    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.SettingForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.uniqueNameValidator, this.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      site_url: ['', Validators.compose([Validators.required,
      Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      phone_number: ['', Validators.compose([Validators.pattern('^[0-9]{10,20}$'), this.uniquePhoneValidator])],
      country_code: [''],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])]
    });
    this.formData = {
      name: String,
      description: String,
      site_url: String,
      phone_number: String,
      country_code: Number,
      email: String
    };
    this.company_address = {
      country: String,
      state: String,
      city: String,
      address: String
    };
    this.spinner.show();
    this.companyUser = JSON.parse(localStorage.getItem('company-admin'));
    this.Id = this.companyUser._id;

    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.get('company/details/' + this.Id).subscribe(resp => {
        this.UserDetails = resp['data'].data;
        if (typeof this.UserDetails.country_code === 'undefined' || this.UserDetails.country_code === 'null' ||
          this.UserDetails.country_code === '') {
          this.UserDetails.country_code = '971';
          this.SettingForm.controls['country_code'].setValue('971');
        } else {
          this.SettingForm.controls['country_code'].setValue(this.UserDetails.country_code);
        }
        this.spinner.hide();
        this.userSettings.inputPlaceholderText = this.UserDetails.company_address.address;
        let addressObj = { response: true, data: this.UserDetails.company_address.address };
        this.userSettings = {
          inputPlaceholderText: this.UserDetails.company_address.address,
          showSearchButton: false,
        };
        this.userSettings = Object.assign({}, this.userSettings);
        this.placeData = addressObj;
        this.service_location = this.UserDetails.service_location;
        this.company_address = this.UserDetails.company_address;
        this.SettingForm.controls['name'].setValue(this.UserDetails.name);
        this.SettingForm.controls['description'].setValue(this.UserDetails.description);
        this.SettingForm.controls['site_url'].setValue(this.UserDetails.site_url);
        this.SettingForm.controls['phone_number'].setValue(this.UserDetails.phone_number);
        this.SettingForm.controls['email'].setValue(this.UserDetails.email);
      });
    }
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
        this.emailData = { 'email': control.value ? control.value.trim() : '', 'company_id': this.companyId };
        return this.service.post('admin/company/checkemail', this.emailData).subscribe(res => {
          if (res['status'] === 'success') {
            this.errMsg = res['message'];
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
        this.phoneData = { 'phone_number': control.value ? control.value.trim() : '', 'company_id': this.companyId };
        return this.service.post('admin/company/checkphone', this.phoneData).subscribe(res => {
          if (res['status'] === 'success') {
            this.phoneErrMsg = res['message'];
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
      this.nameData = { 'name': control.value, 'company_id': this.companyId };
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

  get f() { return this.SettingForm.controls; }

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
    if (!this.SettingForm.invalid) {
      this.isLoading = true;
      if (this.SettingForm.value.phone_number === 'null' || this.SettingForm.value.phone_number === '') {
        this.SettingForm.controls['country_code'].setValue('');
      }
      this.formData = this.SettingForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.name = this.formData.name.trim();
      if (this.formData.phone_number !== null) {
        this.formData.phone_number = this.formData.phone_number.trim();
      }
      this.formData.company_address = this.company_address;
      this.formData.service_location = this.service_location;
      this.formData.company_id = this.Id;
      this.service.put('company/update', this.formData).subscribe(res => {
        this.isLoading = false;
        localStorage.setItem('company-admin', JSON.stringify(res['result'].data));
        this.companyU = {
          name: '',
          company_address: '',
          phone_number: '',
          email: '',
        };
        this.datashare.changeCompanyUser(this.companyU);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        this.router.navigate(['/company/dashboard']);
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

  ngOnInit() { }

  ngAfterViewInit() { }

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
    if (this.SettingForm.controls.phone_number.status === 'INVALID') {
      if (this.SettingForm.controls.phone_number.value.length < 21) {
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
