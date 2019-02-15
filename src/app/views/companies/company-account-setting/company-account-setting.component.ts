import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DataSharingService, AdminUser } from '../../../shared/services/data-sharing.service';

@Component({
  selector: 'app-company-account-setting',
  templateUrl: './company-account-setting.component.html',
  styleUrls: ['./company-account-setting.component.css']
})
export class CompanyAccountSettingComponent implements OnInit {

  public adminU: AdminUser;
  public SettingForm;
  submitted = false;
  public formData: any;
  public Id;
  public companyUser;
  isLoading: boolean;
  public UserDetails;
  public emailData: any;
  public nameData: any;
  public companyId;

  constructor(
    private formBuilder: FormBuilder,
    private service: CrudService,
    private router: Router,
    private messageService: MessageService,
    private datashare: DataSharingService,
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    console.log('companyid==>', this.companyId);

    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.SettingForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.uniqueNameValidator, this.noWhitespaceValidator])],
      site_url: ['', Validators.compose([Validators.required,
      Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      phone_number: ['', Validators.compose([Validators.pattern('\\ *[0-9]{10}\\ *')])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])]
    });
    this.formData = {
      name: String,
      site_url: String,
      phone_number: String,
      email: String
    };
    this.companyUser = JSON.parse(localStorage.getItem('company-admin'));
    this.Id = this.companyUser._id;
    console.log('companyUserId', this.companyUser);
    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.get('company/details/' + this.Id).subscribe(resp => {
        this.UserDetails = resp['data'].data;
        console.log('resp => ', resp['data'].data);
        this.SettingForm.controls['name'].setValue(this.UserDetails.name);
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
      console.log('else => ');
      const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
      let result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value ? control.value.trim() : '', 'company_id': this.companyId };
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
    if (!this.SettingForm.invalid) {
      this.isLoading = true;
      this.formData = this.SettingForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.name = this.formData.name.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      console.log('formadata==>', this.formData);
      this.formData.company_id = this.Id;
      console.log('companyUserId', this.Id);
      this.service.put('company/update', this.formData).subscribe(res => {
        this.isLoading = false;
        localStorage.setItem('company-admin', JSON.stringify(res['result'].data));
        this.adminU = {
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
        };
        this.datashare.changeAdminUser(this.adminU);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        this.router.navigate(['/company/dashboard']);
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
