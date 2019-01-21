import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    // private formBuilder: FormBuilder,
    // public service: CrudService,
    // public router: Router,
    // private messageService: MessageService,
  ) {
    //   var company = JSON.parse(localStorage.getItem('company-admin'));
    //   console.log('detail', company);
    //   this.companyId = company._id;
    //   console.log('companyId => ', this.companyId);
    //   this.cancellationData = [];
    //   this.CancellationForm = this.formBuilder.group({
    //     hours: ['', Validators.required],
    //     rate: ['', Validators.required],
    //   });
    //   this.formData = {
    //     hours: Number,
    //     rate: Number,
    //   };
  }

  ngOnInit() {
    // this.service.get('company/terms_and_condition/' + this.companyId).subscribe(res => {
    //   this.cancellationData = res['data']['cancellation_policy_criteria'];
    //   console.log('res => ', res['data']['cancellation_policy_criteria']);
    // });
  }

  onSubmit() {
    // this.submitted = true;
  }

  // add(hours, rate) {
  //   let cancel = new Cancel(hours, rate);
  //   this.cancellationData.push(cancel);
  // }
}
