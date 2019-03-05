import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Cancel } from '../../../shared/constant/constant';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'app-cancellation-charge',
  templateUrl: './cancellation-charge.component.html',
  styleUrls: ['./cancellation-charge.component.css']
})

export class CancellationChargeComponent implements OnInit {

  // CancellationForm: FormGroup;
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
  public errMsg = [];

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
      this.cancellationData = res['data']['cancellation_policy_criteria'];
      // this.cancellationData = [];
      if (this.cancellationData.length !== 0) {
        this.checked = true;
        this.cancellationData.forEach(element => {
          var obj = { 'hours': element.hours, 'rate': element.rate };
          this.submitArray.push(obj);
          this.errMsg.push({ 'hours': false, 'rate': false });
        });
      } else {
        this.checkCancellation();
      }
    });
  }

  checkCancellation() {
    if (this.checked === false) {
      this.submitArray = [];
      this.serviceobj.company_id = this.companyId;
      this.serviceobj.cancellation_policy_criteria = this.submitArray;
      this.service.put('company/terms_and_condition/update', this.serviceobj).subscribe(res => {
      });
    } else {
      this.submitArray.push({ 'hours': '', 'rate': '' });
      this.errMsg.push({ 'hours': false, 'rate': false });
    }
  }

  ngOnInit() { }

  onSubmit() {
    this.isLoading = true;
    var checkduplicate = [];
    this.submitArray.forEach((element, i) => {
      if (element.hours === '' || element.hours === 0 || element.hours === null ||
        element.rate === '' || element.rate === 0 || element.rate === null || this.errMsg[i].rate === true) {
        this.submitted = false;
      } else {
        checkduplicate.push(element.hours);
        this.submitted = true;
        this.serviceobj.company_id = this.companyId;
        this.serviceobj.cancellation_policy_criteria = this.submitArray;
      }
    });

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
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Input' });
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
    console.log('in add function => ');
    var check = false;
    var ErrMsg = false;
    this.submitArray.forEach((element, i) => {
      if (element.hours === '' || element.hours === 0 || element.hours === null ||
        element.rate === '' || element.rate === 0 || element.rate === null) {
        check = false;
      } else if (this.errMsg[i].rate === true) {
        // ErrMsg = true;
        check = false;
      } else {
        check = true;
      }
    });

    if (check) {
      console.log('in check function => ');
      console.log('this.submitArray before push => ', this.submitArray);
      console.log('this.errMsg before push => ', this.errMsg);
      this.submitArray.push({ 'hours': '', 'rate': '' });
      this.errMsg.push({ 'hours': false, 'rate': false });
      console.log('this.submitArray after push => ', this.submitArray);
      console.log('this.errMsg after push => ', this.errMsg);
    } else {
      console.log('in check else => ');
      // if (ErrMsg) {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Input' });
      // } else {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all feilds First' });
      // }
    }
  }

  restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  deleteThis(index) {
    console.log(' => ');
    console.log('in delete function => ');
    console.log('this.errMsg before splice=> ', this.errMsg);
    console.log('this.submitArray before splice => ', this.submitArray);
    this.submitArray.splice(index, 1);
    this.errMsg.splice(index, 1);
    console.log('this.errMsg after splice => ', this.errMsg);
    console.log('this.submitArray after splice => ', this.submitArray);
  }

  keyup(event, i) {
    if (this.submitArray[i].rate > 99.99) {
      this.errMsg[i].rate = true;
    } else {
      this.errMsg[i].rate = false;
    }
  }

}
