import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//service
import { CrudService } from '../../shared/services/crud.service';
import { AlertService } from '../../shared/services/alert.service';
import { Subscription } from 'rxjs'

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

  private subscription: Subscription;
    message: any;

  constructor( private formBuilder: FormBuilder,
               public service: CrudService,
               public router: Router,
               private alertService : AlertService) { 
                this.subscription = this.alertService.getMessage().subscribe(message => { 
                  this.message = message; 
              });
               }

  ngOnInit() {
    this.formData = {};
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.forgetPasswordForm = this.formBuilder.group ({
      email: ['', [Validators.required, Validators.email,Validators.pattern(pattern)]],
    })
  }

  get f() {return this.forgetPasswordForm.controls; }

  onSubmit(){
    console.log('here')
    this.submitted = true;

    if(!this.forgetPasswordForm.invalid){
      console.log(this.forgetPasswordForm);
      console.log('forget pass form==>',this.forgetPasswordForm.value);
      this.service.post('admin/forget_password', this.forgetPasswordForm.value).subscribe((res) => {
        this.submitted = false;
        console.log('result==>',res);
        this.alertService.success('Email is sent to you Email Id!', true);
        this.router.navigate(['/admin/forget-password']);
        console.log('alert', this.alerts)
      }, error => {
        this.alertService.error('Something went wrong, please try again!!', true);
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
