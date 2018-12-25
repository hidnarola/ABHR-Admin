import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../shared/helpers/must-match.validator';
import { Router, ActivatedRoute } from '@angular/router';
//service
import { CrudService } from '../shared/services/crud.service';
import { MessageService } from 'primeng/api';
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
  public linkData;
  public isExpired;
  public userId;
  public UserType;
  public formData;
  public userName;

  private subscription: Subscription;
  message: any;

  constructor( private formBuilder: FormBuilder,
              public service: CrudService,
              public router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              ) 
              {
                this.route.queryParams.subscribe(params => {
                  if (params['detials']) {
                    let strParams = atob(params['detials']);
                    this.linkData = JSON.parse(strParams);
                    console.log('link data==>' ,this.linkData);
                    if(this.linkData.user_id){
                      this.userId = this.linkData.user_id;
                      this.UserType = 'admin';
                      this.userName = this.linkData.first_name;
                      console.log('admin user name ===>', this.linkData.first_name )
                    }
                    if(this.linkData.company_id){
                      this.userId = this.linkData.company_id;
                      this.UserType = 'company';
                      this.userName = this.linkData.name;
                      console.log('company user name ==>', this.linkData.name )
                    }     
                    let currentTime = new Date().getTime();
                    if (this.linkData.expire_time < currentTime) {
                      this.isExpired = true;
                      this.alerts.push({ type: 'danger', msg: "Your link is expired",})
                    } else {
                      this.isExpired = false;
                    }
                  }
                })
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
      console.log('type',this.UserType);
      if(this.UserType == 'company'){
        this.formData = { 'company_id': this.userId, 
                          'new_password': this.resetPasswordForm.value.password 
                       }
        this.service.post('company/reset_password', this.formData).subscribe((res) => {
        this.submitted = false;
        this.messageService.add({severity:'success', summary:'Success', detail:'Password has been Reset successfully!!'});
          console.log('result==>',res);
        },error => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
        });
        
      } else if(this.UserType == 'admin'){
        this.formData = { 'user_id': this.userId, 
                          'new_password': this.resetPasswordForm.value.password 
                        }
        this.service.post('reset_password', this.formData).subscribe((res) => {
          this.submitted = false;
          this.messageService.add({severity:'success', summary:'Success', detail:'Password has been Reset successfully!!'});
          console.log('result==>',res);
        },error => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
        });
      }
    }
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

}
