import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// service
import { CrudService } from '../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

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
    public err;

    private subscription: Subscription;
    message: any;

    constructor(public router: Router,
        public service: CrudService,
        private formBuilder: FormBuilder,
        private messageService: MessageService) {
        const urlSegment = this.router.url;
        const array = urlSegment.split('/');
        this.CurrentAdmin = array[1];
    }

    ngOnInit() {
        this.formData = {};
        const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
        this.loginForm = this.formBuilder.group({
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]],
        });
    }
    get f() { return this.loginForm.controls; }

    ngAfterViewInit() { }

    onSubmit() {
        this.submitted = true;
        if (!this.loginForm.invalid) {
            if (this.CurrentAdmin === 'admin') {
                this.service.post('admin/login', this.loginForm.value).subscribe(res => {
                    this.submitted = false;
                    localStorage.setItem('admin', JSON.stringify(res['result']));
                    localStorage.setItem('token', res['token']);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successfully' });
                    this.router.navigate(['/admin/dashboard']);
                }, err => {
                    console.log('admin error => ');
                    err = err.error;
                    console.log('err.error => ', err.error);
                    console.log('this.err => ', this.err);
                    console.log('err[] => ');
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
                });
            } else if (this.CurrentAdmin === 'company') {
                this.service.post('company/login', this.loginForm.value).subscribe((res) => {
                    console.log('value', this.loginForm.value)
                    this.submitted = false;
                    localStorage.setItem('company-admin', JSON.stringify(res['result']));
                    localStorage.setItem('token', res['token']);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successfully' });
                    this.router.navigate(['/company/dashboard']);
                }, err => {
                    this.err = err.error;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
                });
            }
            console.log(' empty=> ');
            console.log('err => ', this.err);
            this.submitted = false;
            this.loginForm.controls['password'].setValue('');
            this.loginForm.controls['email'].setValue('');
        }
    }

    forgetPass() {
        // localStorage.clear();
        if (this.CurrentAdmin === 'admin') {
            this.router.navigate(['/admin/forget-password']);
        } else if (this.CurrentAdmin === 'company') {
            this.router.navigate(['/company/forget-password']);
        } else {
            this.router.navigate(['/admin/forget-password']);
        }
    }
}
