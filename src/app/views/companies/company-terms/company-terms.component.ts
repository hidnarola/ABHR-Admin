import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-company-terms',
  templateUrl: './company-terms.component.html',
  styleUrls: ['./company-terms.component.css']
})
export class CompanyTermsComponent implements OnInit, AfterViewInit {
  public termsData;
  text: string;
  values = '';
  form: FormGroup;
  submitted = false;
  public formData: any;
  subtitle: string;
  isLoading: boolean;
  public company;
  public companyId;
  constructor(
    private formbuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    private messageService: MessageService,
  ) {
    var company = JSON.parse(localStorage.getItem('company-admin'));
    console.log('detail', company);
    this.companyId = company._id;
    console.log('companyId => ', this.companyId);
    this.form = this.formbuilder.group({
      terms_and_conditions: ['']
    });
    this.formData = {
      terms_and_conditions: String,
    };
    console.log('form data', this.formData);
  }

  ngOnInit() {
    this.service.get('company/terms_and_condition/' + this.companyId).subscribe(res => {
      this.termsData = res['data'];
      if (this.termsData != null) {
        this.form.controls['terms_and_conditions'].setValue(this.termsData.terms_and_conditions);
      }
    });
  }

  ngAfterViewInit() { }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    this.formData = this.form.value;
    this.formData.company_id = this.companyId;
    console.log('check', this.formData.company_id)
    console.log('this.formData => ', this.formData);
    this.service.put('company/terms_and_condition/update', this.form.value).subscribe(res => {
      console.log('data after submit', res);
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      this.router.navigate(['/company/dashboard']);
    }, err => {
      err = err.error;
      console.log('err => ', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
    console.log('form value => ', this.form.value);
  }
}
