import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
//service
import { CrudService } from '../../shared/services/crud.service';

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

    constructor(public router: Router,
                public service: CrudService,
                private fromBuilder: FormBuilder) {
                    console.log('here');
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
              }, (err) => {
                err = err.error
                this.alerts.push({ type: 'danger', msg: err['message'], 'timeout': 5000 })
              });
        }
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
    }
}
