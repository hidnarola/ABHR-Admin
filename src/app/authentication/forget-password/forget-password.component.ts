import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

// service
import { CrudService } from '../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordForm: FormGroup;
  submitted = false;
  public formData: any;
  public alerts = [];
  public currentUser;
  public AdminType;

  private subscription: Subscription;
  message: any;

  constructor(private formBuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    public route: ActivatedRoute,
    private messageService: MessageService) {
    const user = JSON.parse(localStorage.getItem('admin'));
    const company = JSON.parse(localStorage.getItem('company-admin'));
    if (user != null && user !== undefined) {
      this.AdminType = user.first_name;
    }
    if (company != null && company !== undefined) {
      this.AdminType = company.name;
    }

    const urlSegment = this.router.url;
    const array = urlSegment.split('/');
    this.currentUser = array[1];
  }


  ngOnInit() {
    this.formData = {};
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]],
    });
  }

  get f() { return this.forgetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (!this.forgetPasswordForm.invalid) {
      if (this.currentUser === 'admin') {
        this.service.post('admin/forget_password', this.forgetPasswordForm.value).subscribe((res) => {
          this.submitted = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/admin/forget-password']);
          this.forgetPasswordForm.controls['email'].setValue('');
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      } else if (this.currentUser === 'company') {
        this.service.post('company/forget_password', this.forgetPasswordForm.value).subscribe((res) => {
          this.submitted = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/forget-password']);
          this.forgetPasswordForm.controls['email'].setValue('');
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      }
      this.submitted = false;
      this.forgetPasswordForm.controls['email'].setValue('');
    }
  }

  backToLogin() {
    if (this.currentUser === 'admin') {
      this.router.navigate(['/admin/login']);
    } else if (this.currentUser === 'company') {
      this.router.navigate(['/company/login']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}
