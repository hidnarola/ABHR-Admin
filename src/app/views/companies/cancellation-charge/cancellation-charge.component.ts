import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Cancel } from '../../../shared/constant/constant';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cancellation-charge',
  templateUrl: './cancellation-charge.component.html',
  styleUrls: ['./cancellation-charge.component.css']
})

export class CancellationChargeComponent implements OnInit {

  CancellationForm: FormGroup;
  submitted = false;
  public formData: any;
  public cancellationData;
  contacts: Array<Cancel>;
  isLoading: boolean;
  public company;
  public companyId;
  public submitArray = [];
  public serviceobj: any;
  public cancellationArray = [];
  public Errmsg;
  constructor(
    private formBuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    private messageService: MessageService,
  ) {
    this.company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = this.company._id;
    this.cancellationData = [];

    this.serviceobj = {
      company_id: String,
      cancellation_policy_criteria: Array
    }

    this.service.get('company/terms_and_condition/' + this.companyId).subscribe(res => {
      console.log('res => ', res);
      this.cancellationData = res['data']['cancellation_policy_criteria'];
      this.cancellationData.forEach(element => {
        var obj = { 'hours': element.hours, 'rate': element.rate };
        this.submitArray.push(obj);
      });
      console.log('res => ', this.submitArray);
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitArray.forEach(element => {
      if (element.hours === '' || element.hours === 0 || element.hours === null ||
        element.rate === '' || element.rate === 0 || element.rate === null) {
        this.submitted = false;
        this.Errmsg = 'Please fill all feilds First';
      } else {
        // var checkhour = element.hours;
        // this.submitArray.forEach(ele => {
        //   if (ele.hours !== '' || ele.hours !== 0 || ele.hours !== null) {
        //     if (checkhour === ele.hours) {
        //       this.submitted = false;
        //       this.Errmsg = 'Please remove duplicate hours';
        //       console.log('in if=======================');
        //       return true;
        //     } else {
        //       console.log('in else=======================');
        //       this.submitted = true;
        //     }
        //   }
        // });
        this.submitted = true;
        this.serviceobj.company_id = this.companyId;
        console.log('this.serviceobj.company_id  => ', this.serviceobj.company_id);
        this.serviceobj.cancellation_policy_criteria = this.submitArray;
      }
    });
    if (this.submitted) {
      console.log(' this.serviceobj=> ', this.serviceobj);
      this.service.put('company/terms_and_condition/update', this.serviceobj).subscribe(res => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        this.router.navigate(['/company/dashboard']);
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    } else {
      this.isLoading = false;
      // console.log(' 1=> ');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.Errmsg });
    }
  }

  addNext() {
    var check = false;
    this.submitArray.forEach(element => {
      if (element.hours === '' || element.hours === 0 || element.hours === null ||
        element.rate === '' || element.rate === 0 || element.rate === null) {
        check = false;
      } else {
        check = true;
      }
    });
    if (check) {
      this.submitArray.push({ 'hours': '', 'rate': '' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all feilds First' });
    }
  }

  deleteThis(index) {
    // (this.CancellationForm.controls['Cancellation'] as FormArray).removeAt(index);
    this.submitArray.splice(index, 1);
    console.log('this.CancellationForm.controls => ', this.cancellationData);
  }
}
