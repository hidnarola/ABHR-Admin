import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CrudService } from '../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DataSharingService, AdminUser } from '../../../shared/services/data-sharing.service';

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
  public emailData: any;
  public Id;
  public user;
  isLoading: boolean;
  public UserDetails;
  public isEdit;

  constructor(
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
    private datashare: DataSharingService,
  ) {
    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.SettingForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      phone_number: ['', Validators.compose([Validators.required, Validators.pattern('\\ *[0-9]{10}\\ *')])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])],
      support_email: ['', Validators.compose([Validators.required, Validators.pattern(pattern), Validators.email])],
      support_site_url: ['', Validators.compose([Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      support_phone_number: ['', Validators.compose([Validators.required, Validators.pattern('\\ *[0-9]{10}\\ *')])],
    });
    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      email: String,
      support_phone_number: Number,
      support_email: String,
      support_site_url: String
    };
    this.user = JSON.parse(localStorage.getItem('admin'));
    this.Id = this.user._id;
    console.log('userId', this.Id);
    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.get('admin/details/' + this.Id).subscribe(resp => {
        this.UserDetails = resp['result'].data;
        console.log('this.UserDetails => ', this.UserDetails);
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
        console.log('emailData===>', this.emailData);
        return this.service.post('admin/checkemail', this.emailData).subscribe(res => {
          console.log('res for emailData => ', res);
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

  onSubmit() {
    this.submitted = true;
    if (!this.SettingForm.invalid) {
      this.isLoading = true;
      this.formData = this.SettingForm.value;
      console.log('this.SettingForm.value => ', this.SettingForm.value);
      console.log('this.formData => ', this.formData);
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      console.log('formadata==>', this.formData);
      this.formData.user_id = this.Id;
      console.log('userId', this.Id);
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

}
