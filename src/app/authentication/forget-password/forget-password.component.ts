import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//service
import { CrudService } from '../../shared/services/crud.service';

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

  constructor( private formBuilder: FormBuilder,
               public service: CrudService,
               public router: Router,) { }

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
        this.alerts.push({ type: 'success', msg: res['message'], 'timeout': 5000 });
        this.router.navigate(['/admin/login']);
        console.log('alert', this.alerts)
      }, (err) => {
        err = err.error
        this.alerts.push({ type: 'danger', msg: err['message'], 'timeout': 5000 })
      });
    }
  }

}
