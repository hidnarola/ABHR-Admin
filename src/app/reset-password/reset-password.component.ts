import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../shared/helpers/must-match.validator';
import { Router } from '@angular/router';
//service
import { CrudService } from '../shared/services/crud.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  public alerts = [];

  constructor( private formBuilder: FormBuilder,
              public service: CrudService,
              public router: Router,) { }

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
        console.log('result==>',res);
      }, (err) => {
        err = err.error
        this.alerts.push({ type: 'danger', msg: err['message'], 'timeout': 5000 })
      });
    }
  }

}
