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

  // CancellationForm: FormGroup;
  // submitted = false;
  // public formData: any;
  // public cancellationData;
  // contacts: Array<Cancel>;
  // isLoading: boolean;
  // public company;
  // public companyId;
  // public submitArray = [];
  // public cancellationArray = [];
  constructor(
    // private formBuilder: FormBuilder,
    // public service: CrudService,
    // public router: Router,
    // private messageService: MessageService,
  ) {
    // this.company = JSON.parse(localStorage.getItem('company-admin'));
    // console.log('detail', this.company);
    // this.companyId = this.company._id;
    // console.log('companyId => ', this.companyId);
    // this.cancellationData = [];


    // this.service.get('company/terms_and_condition/' + this.companyId).subscribe(res => {
    //   console.log('res => ', res);
    //   this.cancellationData = res['data']['cancellation_policy_criteria'];
    //   this.cancellationData.forEach(element => {
    //     var obj = { 'hours': element.hours, 'rate': element.rate };
    //     this.submitArray.push(obj);
    //   });
    //   console.log('res => ', this.submitArray);
    // });
    // this.CancellationForm = this.formBuilder.group({
    //   Cancellation: this.formBuilder.array([
    //     this.createItem()
    //   ]),
    //   hours: [''],
    //   rate: [''],
    // });
    // console.log(this.CancellationForm);
    // this.formData = {
    //   hours: Number,
    //   rate: Number,
    // };
  }
  // createItem() {
  //   return this.formBuilder.group({
  //     hours: [''],
  //     rate: [''],
  //   });
  // }

  // get f() { return this.CancellationForm.controls['Cancellation'] as FormArray; }

  ngOnInit() {
  }

  // onSubmit() {
  //   this.submitted = true;
  //   this.cancellationData.cancellation_policy_criteria = this.submitArray;
  //   console.log('data on submit=====>', this.cancellationData.cancellation_policy_criteria);
  // }

  // addNext() {
  //   // var count = parseInt(this.submitArray.length) + 1;
  //   // console.log(count);
  //   this.submitArray.push({ 'hours': 0, 'rate': 0 });
  // }

  // deleteThis(index) {
  //   // (this.CancellationForm.controls['Cancellation'] as FormArray).removeAt(index);
  //   this.submitArray.splice(index, 1);
  //   console.log('this.CancellationForm.controls => ', this.cancellationData);
  // }
}
