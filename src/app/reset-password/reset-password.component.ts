import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../shared/helpers/must-match.validator';
import { Router } from '@angular/router';
//service
import { CrudService } from '../shared/services/crud.service';
import { AlertService } from '../shared/services/alert.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
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
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required]
    },{
      validator: MustMatch('password', 'repeatPassword')
    }
    );
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    if(!this.resetPasswordForm.invalid){
      console.log(this.resetPasswordForm);
      console.log('forget pass form==>',this.resetPasswordForm.value);
      this.service.post('admin/reset_password', this.resetPasswordForm.value).subscribe((res) => {
        this.submitted = false;
        this.alertService.success('Password is Reset!!', true);
        console.log('result==>',res);
      },error => {
        this.alertService.error('Something went wrong, please try again!!', true);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
