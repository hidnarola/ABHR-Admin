import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
//service
import { CrudService } from '../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    submitted = false;
    public formData: any;
    public alerts = [];
    public CurrentAdmin;

    private subscription: Subscription;
    message: any;

    constructor(public router: Router,
                public service: CrudService,
                private fromBuilder: FormBuilder,
                private messageService: MessageService,) {
                    var urlSegment = this.router.url;
                    console.log('urlsegment in login==>', urlSegment)
                    var array = urlSegment.split('/');
                    console.log(array[1]);
                    this.CurrentAdmin = array[1];
                }

    ngOnInit() {
        this.formData = {};
        const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
        this.loginForm = this.fromBuilder.group({
            password: ['',Validators.required],
            email: ['', [Validators.required, Validators.email,Validators.pattern(pattern)]],
        })
    }
    get f() { return this.loginForm.controls; }

    ngAfterViewInit() {}

    onSubmit(){
        console.log('here');
        this.submitted = true;

        if(!this.loginForm.invalid){
            if(this.CurrentAdmin == 'admin'){
                this.service.post('admin/login', this.loginForm.value).subscribe((res) => {
                    this.submitted = false;
                    console.log('result==>',res);
                    localStorage.setItem('admin',JSON.stringify(res['result']))
                    localStorage.setItem('token',res['token'])
                    console.log('token', res['result'])
                    this.router.navigate(['/admin/dashboard']);
                  },  error => {
                    this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
                });
            } else if(this.CurrentAdmin == 'company'){
                this.service.post('company/login', this.loginForm.value).subscribe((res) => {
                    console.log('value', this.loginForm.value)
                    this.submitted = false;
                    console.log('result==>',res);
                    localStorage.setItem('company-admin',JSON.stringify(res['result']))
                    localStorage.setItem('token',res['token'])
                    console.log('token', res['token'])
                    this.router.navigate(['/company/dashboard']);
                  },  error => {
                    this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
                });
            }
           
        }
    }

    ngOnDestroy() { }
      
}
