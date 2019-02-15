import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

// model
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// popup-forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  public index;
  public viewData;
  public userId;
  public agentDetails;
  isCols: boolean;

  private subscription: Subscription;
  message: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public emailData: any;
  public isEdit;
  public rentalData;
  closeResult: string;
  public pageNumber;
  public totalRecords;
  isLoading: boolean;

  constructor(
    public renderer: Renderer,
    private dataShare: DataSharingService,
    private route: ActivatedRoute,
    private service: CrudService,
    private modalService: NgbModal,
    public router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => {
      this.userId = params.id;
      console.log('this.userId => ', this.userId);
    });
    // addform validation
    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.AddEditForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      phone_number: ['', [Validators.pattern('\\ *[0-9]{10}\\ *')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator]],
      // deviceType: [''],
    });
    this.formData = {
      first_name: String,
      last_name: String,
      // deviceType: String,
      phone_number: Number,
      email: String
    };
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true }
  }
  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace;
    if (isWhitespace = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value ? control.value.trim() : '' };
        console.log('control.value => ', control.value);
        if (this.isEdit) {
          this.emailData = { 'email': control.value ? control.value.trim() : '', 'user_id': this.userId };
        }
        console.log('emailData===>', this.emailData);
        return this.service.post('admin/checkemail', this.emailData).subscribe(res => {
          console.log('res for emailData => ', res);
          if (res['status'] === 'success') {
            this.f.email.setErrors({ 'unique': true });
            return;
          } else {
            this.f.email.setErrors(null);
          }
        });
      }
    }
  }
  // add-edit-popup form validation
  get f() {
    return this.AddEditForm.controls;
  }

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      console.log('in valid', this.userId);
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      this.formData.user_id = this.userId;
      console.log(this.formData);
      this.service.put('admin/agents/update', this.formData).subscribe(res => {
        this.isLoading = false;
        console.log('response after edit===>', res);
        console.log('this.agentDetails==>', this.agentDetails);
        this.agentDetails = this.formData;
        this.closePopup();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        this.closePopup();
      });
      this.submitted = false;
    }
  }

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  RentalData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[4, 'desc']],
      language: {
        'processing': '',
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        console.log('dataparametes==>', dataTablesParameters);
        dataTablesParameters['columns'][0]['isNumber'] = true;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        setTimeout(() => {
          dataTablesParameters.agent_id = this.userId;
          this.service.post('admin/agents/rental_list', dataTablesParameters).subscribe(res => {
            console.log('rentals res in agents', res);
            this.rentalData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            console.log('this.totalRecords => ', this.totalRecords);
            // this.rentalData = [];
            if (this.rentalData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            if (this.totalRecords > this.pageNumber) {
              $('.dataTables_paginate').css('display', 'block');
            } else {
              $('.dataTables_paginate').css('display', 'none');
            }
            this.spinner.hide();
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
          });
        }, 1000);
      },
      columns: [
        {
          data: 'Contract No.',
          name: 'booking_number'
        },
        {
          data: 'Client Name',
          name: 'name',
        },
        {
          data: 'Price',
          name: 'booking_rent',
        },
        {
          data: 'Start Of Rent',
          name: 'from_time',
        },
        {
          data: 'End Of Rent',
          name: (('to_time') && ('createdAt')),
        }
      ]
    };
  }

  AgentDetails() {
    this.service.get('admin/agents/details/' + this.userId).subscribe(res => {
      console.log('userdetails==>', res);
      if (res['user'] !== null) {
        this.agentDetails = res['user'];
      } else {
        this.router.navigate(['/admin/agents']);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No Record Found' });
      }

    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // model
  open2(content, agentDetails) {
    this.isLoading = false;
    console.log('agentDetails====>', agentDetails);
    if (agentDetails !== 'undefined' && agentDetails) {
      this.isEdit = true;
      this.AddEditForm.controls['first_name'].setValue(agentDetails.first_name);
      this.AddEditForm.controls['last_name'].setValue(agentDetails.last_name);
      this.AddEditForm.controls['email'].setValue(agentDetails.email);
      this.AddEditForm.controls['phone_number'].setValue(agentDetails.phone_number);
      // this.AddEditForm.controls['deviceType'].setValue(agentDetails.deviceType);
      console.log('firstname', agentDetails.first_name);
      console.log('lastname===>', agentDetails.last_name);
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
    this.submitted = false;
  }

  // add-edit popup ends here

  ngOnInit() {
    this.RentalData();
    this.AgentDetails();
  }

}
