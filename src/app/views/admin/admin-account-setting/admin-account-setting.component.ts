import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public Id;
  public user;
  isLoading: boolean;
  public UserDetails;

  constructor(
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
    private datashare: DataSharingService,
  ) {
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.SettingForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^([0-9]){10}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });
    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      email: String
    };
    this.user = JSON.parse(localStorage.getItem('admin'));
    this.Id = this.user._id;
    console.log('userId', this.Id);
    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.get('admin/details/' + this.Id).subscribe(resp => {
        this.UserDetails = resp['result'].data;
        this.SettingForm.controls['first_name'].setValue(this.UserDetails.first_name);
        this.SettingForm.controls['last_name'].setValue(this.UserDetails.last_name);
        this.SettingForm.controls['phone_number'].setValue(this.UserDetails.phone_number);
        this.SettingForm.controls['email'].setValue(this.UserDetails.email);
      });
    }
  }
  get f() { return this.SettingForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (!this.SettingForm.invalid) {
      this.isLoading = true;
      this.formData = this.SettingForm.value;
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
          email: res['result'].data.email
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
