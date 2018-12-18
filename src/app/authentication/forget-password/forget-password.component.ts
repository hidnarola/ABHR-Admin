import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//service
import { CrudService } from '../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
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
               private messageService: MessageService,) { }

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
        this.messageService.add({severity:'success', summary:'Success', detail:'Email is sent to you Email Id!!'});
        this.router.navigate(['/admin/forget-password']);
        console.log('alert', this.alerts)
      }, error => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
      });
    }
  }
  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
