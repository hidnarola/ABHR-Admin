import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-terms',
  templateUrl: './admin-terms.component.html',
  styleUrls: ['./admin-terms.component.css']
})
export class AdminTermsComponent implements OnInit, AfterViewInit {
  public termsData;
  text: string;
  values = '';
  form: FormGroup;
  submitted = false;
  public formData: any;
  subtitle: string;
  isLoading: boolean;
  constructor(
    private formbuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.formbuilder.group({
      about_us: [''],
      copyright: [''],
      term_condition: [''],
      privacy_policy: [''],
    });
    this.formData = {
      about_us: String,
      copyright: String,
      term_condition: String,
      privacy_policy: String,
    };
    console.log('form data', this.formData);
  }

  ngOnInit() {
    this.service.get('admin/legal_settings').subscribe(res => {
      this.termsData = res['data'];
      if (this.termsData != null) {
        this.form.controls['about_us'].setValue(this.termsData.about_us);
        this.form.controls['copyright'].setValue(this.termsData.copyright);
        this.form.controls['term_condition'].setValue(this.termsData.term_condition);
        this.form.controls['privacy_policy'].setValue(this.termsData.privacy_policy);
      }
      console.log('termsData', this.termsData);
      console.log('response in legal setting', res['data']);
    });
  }

  ngAfterViewInit() { }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    this.service.put('admin/legal_settings/update', this.form.value).subscribe(res => {
      console.log('data after submit', res);
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      this.router.navigate(['/admin/dashboard']);
    }, err => {
      err = err.error;
      this.isLoading = false;
      console.log('err => ', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
    console.log('form value => ', this.form.value);
  }
}
