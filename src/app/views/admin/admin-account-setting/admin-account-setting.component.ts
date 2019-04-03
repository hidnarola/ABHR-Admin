import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DataSharingService, AdminUser } from '../../../shared/services/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { cc } from '../../../shared/constant/country_code';

@Component({
  selector: 'app-admin-account-setting',
  templateUrl: './admin-account-setting.component.html',
  styleUrls: ['./admin-account-setting.component.css']
})
export class AdminAccountSettingComponent implements OnInit {
  public adminU: AdminUser;
  SettingForm: FormGroup;
  submitted = false;
  public formData: any;
  public phoneData: any;
  public supportPhoneData: any;
  public emailData: any;
  public Id;
  public user;
  isLoading: boolean;
  public UserDetails;
  public isEdit;
  public errMsg;
  public phoneErrMsg;
  public supportPhoneErrMsg;
  public numberErr: boolean = false;
  public numberErr2: boolean = false;
  public countryCode: SelectItem[];
  selectedCc: string;
  public supportCountryCode: SelectItem[];
  supportSelectedCc: string;

  constructor(
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
    private datashare: DataSharingService,
    private spinner: NgxSpinnerService
  ) {
    this.countryCode = cc;
    this.supportCountryCode = cc;

    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.SettingForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+$'), this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+$'), this.noWhitespaceValidator])],
      phone_number: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,20}$'), this.uniquePhoneValidator])],
      country_code: [''],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])],
      support_email: ['', Validators.compose([Validators.required, Validators.pattern(pattern), Validators.email])],
      support_site_url: ['', Validators.compose([Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      support_phone_number:
        ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,20}$'), this.uniqueSupportPhoneValidator])],
      support_country_code: [''],
    });
    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      country_code: Number,
      email: String,
      support_phone_number: Number,
      support_country_code: Number,
      support_email: String,
      support_site_url: String
    };
    this.spinner.show();
    this.user = JSON.parse(localStorage.getItem('admin'));

    this.Id = this.user._id;
    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.get('admin/details/' + this.Id).subscribe(resp => {
        this.UserDetails = resp['result'].data;
        console.log('this.UserDetails => ', this.UserDetails);
        if (typeof this.UserDetails.country_code === 'undefined' || this.UserDetails.country_code === 'null' ||
          this.UserDetails.country_code === '' || typeof this.UserDetails.support_country_code === 'undefined' ||
          this.UserDetails.support_country_code === 'null' || this.UserDetails.support_country_code === '') {
          this.UserDetails.country_code = '971';
          this.SettingForm.controls['country_code'].setValue('971');
          this.UserDetails.support_country_code = '971';
          this.SettingForm.controls['support_country_code'].setValue('971');
        } else {
          this.SettingForm.controls['country_code'].setValue(this.UserDetails.country_code);
          this.SettingForm.controls['support_country_code'].setValue(this.UserDetails.support_country_code);
        }
        this.spinner.hide();
        this.SettingForm.controls['first_name'].setValue(this.UserDetails.first_name);
        this.SettingForm.controls['last_name'].setValue(this.UserDetails.last_name);
        this.SettingForm.controls['phone_number'].setValue(this.UserDetails.phone_number);
        this.SettingForm.controls['email'].setValue(this.UserDetails.email);
        this.SettingForm.controls['support_email'].setValue(this.UserDetails.support_email);
        this.SettingForm.controls['support_phone_number'].setValue(this.UserDetails.support_phone_number);
        this.SettingForm.controls['support_site_url'].setValue(this.UserDetails.support_site_url);
      });
    }
  }
  get f() { return this.SettingForm.controls; }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace;
    if (isWhitespace = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value ? control.value.trim() : '', 'user_id': this.Id };
        return this.service.post('admin/checkemail', this.emailData).subscribe(res => {
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
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.phoneData = { 'phone_number': control.value ? control.value.trim() : '', 'user_id': this.Id };
        return this.service.post('admin/checkphone', this.phoneData).subscribe(res => {
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

  public uniqueSupportPhoneValidator = (control: FormControl) => {
    let isWhitespaceSupportPhone;
    if (isWhitespaceSupportPhone = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^[0-9]{10,20}$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.supportPhoneData = { 'phone_number': control.value ? control.value.trim() : '', 'user_id': this.Id };
        return this.service.post('admin/checkphone', this.supportPhoneData).subscribe(res => {
          if (res['status'] === 'success') {
            console.log('res => ', res);
            this.supportPhoneErrMsg = res['message'];
            console.log('this.supportPhoneErrMsg => ', this.supportPhoneErrMsg);
            this.f.support_phone_number.setErrors({ 'unique': true });
            return;
          } else {
            this.f.support_phone_number.setErrors(null);
          }
        });
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.numberErr = false;
    this.numberErr2 = false;
    console.log('this.SettingForm => ', this.SettingForm);
    if (!this.SettingForm.invalid) {
      this.isLoading = true;
      this.formData = this.SettingForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      this.formData.user_id = this.Id;
      this.service.put('admin/update', this.formData).subscribe(res => {
        this.isLoading = false;
        localStorage.setItem('admin', JSON.stringify(res['result'].data));
        this.adminU = {
          first_name: res['result'].data.first_name,
          last_name: res['result'].data.last_name,
          phone_number: res['result'].data.phone_number,
          email: res['result'].data.email,
        };
        this.datashare.changeAdminUser(this.adminU);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        this.router.navigate(['/admin/dashboard']);
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }
  ngOnInit() {
  }

  onchange(event) { }

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
    if (this.SettingForm.controls.support_phone_number.status === 'INVALID') {
      if (this.SettingForm.controls.support_phone_number.value.length < 21) {
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

  keyup2(event) {
    if (this.SettingForm.controls.phone_number.status === 'INVALID') {
      if (this.SettingForm.controls.phone_number.value.length < 21) {
        this.numberErr2 = false;
      } else {
        this.numberErr2 = true;
      }

    } else {
      this.numberErr2 = false;
    }
    if (this.submitted === true) {
      this.numberErr2 = false;
    }
  }

}
