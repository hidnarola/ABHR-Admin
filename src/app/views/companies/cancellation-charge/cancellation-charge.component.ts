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
  checked: boolean = false;

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
    };

    this.service.get('company/terms_and_condition/' + this.companyId).subscribe(res => {
      console.log('res => ', res);
      this.cancellationData = res['data']['cancellation_policy_criteria'];
      // this.cancellationData = [];
      console.log('this.cancellationData => ', this.cancellationData);
      if (this.cancellationData.length !== 0) {
        this.checked = true;
        this.cancellationData.forEach(element => {
          var obj = { 'hours': element.hours, 'rate': element.rate };
          this.submitArray.push(obj);
        });
      } else {
        this.checkCancellation();
      }
      console.log('res => ', this.submitArray);
    });
  }

  checkCancellation() {
    if (this.checked === false) {
      this.submitArray = [];
      this.serviceobj.company_id = this.companyId;
      this.serviceobj.cancellation_policy_criteria = this.submitArray;
      this.service.put('company/terms_and_condition/update', this.serviceobj).subscribe(res => {
        console.log('res false => ', res);
      });
    } else {
      this.submitArray.push({ 'hours': '', 'rate': '' });
      console.log('on click function else => ');
    }
  }
  ngOnInit() {
  }

  onSubmit() {
    this.isLoading = true;
    var checkduplicate = [];
    this.submitArray.forEach(element => {
      if (element.hours === '' || element.hours === 0 || element.hours === null ||
        element.rate === '' || element.rate === 0 || element.rate === null) {
        this.submitted = false;
      } else {
        checkduplicate.push(element.hours);
        this.submitted = true;
        this.serviceobj.company_id = this.companyId;
        this.serviceobj.cancellation_policy_criteria = this.submitArray;
      }
    });
    console.log('checkduplicate===>', checkduplicate);

    if (this.submitted) {
      var check = this.checkCommon(checkduplicate);
      if (check) {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please remove duplicate feilds first' });
      } else {
        this.service.put('company/terms_and_condition/update', this.serviceobj).subscribe(res => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/dashboard']);
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      }
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all feilds first' });
    }
  }

  checkCommon(a) {
    for (var i = 0; i <= a.length; i++) {
      for (var j = i; j <= a.length; j++) {
        if (i !== j && a[i] === a[j]) {
          return true;
        }
      }
    }
    return false;
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

  checkNumber(event) {
    var inputValue = !isNaN(parseFloat(event.target.value)) && isFinite(event.target.value);
    console.log('inputValue => ', inputValue);
    if (inputValue === false) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Input' });
    }
  }
  deleteThis(index) {
    this.submitArray.splice(index, 1);
    console.log('this.CancellationForm.controls => ', this.cancellationData);
  }
}
