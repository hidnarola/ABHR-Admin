import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-account-setting',
  templateUrl: './company-account-setting.component.html',
  styleUrls: ['./company-account-setting.component.css']
})
export class CompanyAccountSettingComponent implements OnInit {

  public SettingForm;
  submitted = false;
  public formData: any;
  public Id;
  public companyUser;
  isLoading: boolean;
  public UserDetails;

  constructor(
    private formBuilder: FormBuilder,
    private service: CrudService,
    private router: Router,
    private messageService: MessageService
  ) {
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.SettingForm = this.formBuilder.group({
      name: ['', Validators.required],
      // last_name: ['', Validators.required],
      site_url: ['', [Validators.required, Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')]],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^([0-9]){10}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });
    this.formData = {
      name: String,
      // last_name: String,
      site_url: String,
      phone_number: Number,
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
        // this.SettingForm.controls['last_name'].setValue(this.UserDetails.last_name);
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
        this.formData.company_id = this.Id;
        console.log('companyUserId', this.Id);
        this.service.put('admin/company/update', this.formData).subscribe(res => {
          console.log('res => ', res);
          localStorage.setItem('company-admin', JSON.stringify(res['data'].data));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/dashboard']);
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
  }
}

  ngOnInit() {
  }

}
