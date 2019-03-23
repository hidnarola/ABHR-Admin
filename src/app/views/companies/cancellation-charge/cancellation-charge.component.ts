import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Cancel } from '../../../shared/constant/constant';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

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
        this.cancellationData.forEach((element, i) => {
          this.submitArray.push(element);
          this.errMsg.push({ _id: element._id, 'hours': false, 'rate': false });
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
      const ts = moment().unix();
      this.submitArray.push({ _id: ts, 'hours': '', 'rate': '' });
      this.errMsg.push({ _id: ts, 'hours': false, 'rate': false });
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
        delete element._id;
        checkduplicate.push(element.hours);
        this.submitted = true;
        this.serviceobj.company_id = this.companyId;
        this.serviceobj.cancellation_policy_criteria = this.submitArray;
      }
    });

    if (this.submitted) {
      var check = this.checkCommon(checkduplicate);
      console.log('check on submit => ', check);
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
    }
  }

  checkCommon(a) {
    console.log('a => ', a);
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
    let check = true;
    const checkDuplicate = [];
    console.log('checkDuplicate  => ', checkDuplicate);
    console.log('this.submitArray => ', this.submitArray);
    this.submitArray.forEach((element, i) => {
      var checkhours = this.checkCommon(checkDuplicate.push(element.hours));
      console.log('checkhours => ', checkhours);
      if ((element.hours === '' || element.hours === 0 || element.hours === null) ||
        (element.rate === '' || element.rate === 0 || element.rate === null)) {
        check = false;
      } if (this.errMsg[i].rate === true) {
        check = false;
      }
    });
    if (check) {
      const ts = moment().unix();
      this.submitArray.push({ _id: ts, 'hours': '', 'rate': '' });
      this.errMsg.push({ _id: ts, 'hours': false, 'rate': false });
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
    this.submitArray.splice(index, 1);
    this.errMsg.splice(index, 1);
  }

  keyup(event, i) {
    if (this.submitArray[i].rate > 99.99) {
      this.errMsg[i].rate = true;
    } else {
      this.errMsg[i].rate = false;
    }
  }

}
