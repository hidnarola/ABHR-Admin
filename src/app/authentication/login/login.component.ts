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

    private subscription: Subscription;
    message: any;

    constructor(public router: Router,
                public service: CrudService,
                private fromBuilder: FormBuilder,
                private messageService: MessageService,) {}

    ngOnInit() {
        this.formData = {};
        const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
        this.loginForm = this.fromBuilder.group({
            password: ['',Validators.required],
            email: ['', [Validators.required, Validators.email,Validators.pattern(pattern)]],
        })
    }
    get f() { return this.loginForm.controls; }

    ngAfterViewInit() {
        /*$(function() {
            $(".preloader").fadeOut();
        });
        
        $('#to-recover').on("click", function() {
            $("#loginform").slideUp();
            $("#recoverform").fadeIn();
        });*/
    }

    // onLoggedin() {
    //     localStorage.setItem('isLoggedin', 'true');
    // }

    onSubmit(){
        console.log('here');
        this.submitted = true;

        if(!this.loginForm.invalid){
            console.log(this.loginForm);
            console.log('login form==>', this.loginForm.value);
            console.log('formdata==>', this.formData)
            this.service.post('admin/login', this.loginForm.value).subscribe((res) => {
                this.submitted = false;
                console.log('result==>',res);
                localStorage.setItem('admin',JSON.stringify(res['result']))
                localStorage.setItem('token',res['token'])
                this.router.navigate(['/admin/dashboard']);
              },  error => {
                this.messageService.add({severity:'error', summary:'Error', detail:'Something went wrong, please try again!!'});
              });
        }
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
      }
      
}
