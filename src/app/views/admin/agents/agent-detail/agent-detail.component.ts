import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { cc } from '../../../../shared/constant/country_code';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public index;
  public viewData;
  public userId;
  public agentDetails;
  isCols: boolean;
  message: any;
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
  public numberErr: boolean = false;
  public countryCode: SelectItem[];
  selectedCc: string;
  public phoneData: any;
  public errMsg;
  public phoneErrMsg;
  public modalData;

  constructor(
    public renderer: Renderer,
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
    });
    // addform validation
    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.AddEditForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      phone_number: ['', [Validators.pattern('^[0-9]{10,20}$'), this.uniquePhoneValidator]],
      country_code: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator]],
      // deviceType: [''],
    });
    this.formData = {
      first_name: String,
      last_name: String,
      // deviceType: String,
      phone_number: Number,
      country_code: Number,
      email: String
    };
    this.countryCode = cc;
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
        if (this.isEdit) {
          this.emailData = { 'email': control.value ? control.value.trim() : '', 'user_id': this.userId };
        }
        return this.service.post('admin/checkemail', this.emailData).subscribe(res => {
          if (res['status'] === 'success') {
            this.errMsg = res['message'];
            this.f.email.setErrors({ 'unique': true });
            return;
          } else {
            this.f.email.setErrors(null);
          }
        });
      }
    }
  }

  public uniquePhoneValidator = (control: FormControl) => {
    let isWhitespacePhone;
    if (isWhitespacePhone = (control.value || '').trim().length !== 0) {
      const pattern = new RegExp('^[0-9]{10,20}$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.phoneData = { 'phone_number': control.value ? control.value.trim() : '' };
        if (this.isEdit) {
          this.phoneData = { 'phone_number': control.value ? control.value.trim() : '', 'user_id': this.userId };
        }
        return this.service.post('admin/checkphone', this.phoneData).subscribe(res => {
          if (res['status'] === 'success') {
            this.phoneErrMsg = res['message'];
            this.f.phone_number.setErrors({ 'unique': true });
            return;
          } else {
            this.f.phone_number.setErrors(null);
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
    if (element !== null) {
      element.click();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.numberErr = false;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      if (this.formData.phone_number !== null) {
        this.formData.phone_number = this.formData.phone_number.trim();
      } else {
        this.formData.country_code = null;
        // console.log('this.formData.country_code => ', this.formData.country_code);
      }
      this.formData.user_id = this.userId;
      this.service.put('admin/agents/update', this.formData).subscribe(res => {
        this.isLoading = false;
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
    console.log('this.modalData on destroy => ', this.modalData);
    if (this.modalData !== undefined) {
      this.closePopup();
    }
  }

  RentalData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[5, 'desc']],
      language: {
        'processing': '',
      },
      responsive: true,
      destroy: true,
      // scrollX: true,
      // scrollCollapse: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][0]['isNumber'] = true;
        dataTablesParameters['columns'][2]['isNumber'] = true;
        setTimeout(() => {
          dataTablesParameters.agent_id = this.userId;
          this.service.post('admin/agents/rental_list', dataTablesParameters).subscribe(res => {
            this.rentalData = res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.rentalData = [];
            if (this.rentalData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            } else {
              if (dataTablesParameters['search']['value'] !== '' && dataTablesParameters['search']['value'] !== null) {
                this.isCols = true;
              } else {
                this.isCols = false;
              }
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
            window.scrollTo(0, 0);
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
          name: 'to_time',
        },
        {
          data: 'Member Since',
          name: 'createdAt',
        }
      ]
    };
  }

  AgentDetails() {
    this.service.get('admin/agents/details/' + this.userId).subscribe(res => {
      console.log('res[] => ', res['user']);
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
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      $(table.column(idx).header()).append('<span class="sort-icon"/>');
    });
  }

  // model
  open2(content, agentDetails) {
    this.modalData = content;
    console.log('content => ', content);
    console.log('agentDetails => ', agentDetails);
    console.log('agentDetails.country_code => ', agentDetails.country_code);
    this.isLoading = false;
    if (agentDetails !== 'undefined' && agentDetails) {
      this.isEdit = true;
      this.AddEditForm.controls['first_name'].setValue(agentDetails.first_name);
      this.AddEditForm.controls['last_name'].setValue(agentDetails.last_name);
      this.AddEditForm.controls['email'].setValue(agentDetails.email);
      this.AddEditForm.controls['phone_number'].setValue(agentDetails.phone_number);
      this.AddEditForm.controls['country_code'].setValue(agentDetails.country_code);
      // this.AddEditForm.controls['deviceType'].setValue(agentDetails.deviceType);
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
    this.numberErr = false;
  }

  // add-edit popup ends here

  ngOnInit() {
    this.isCols = true;
    this.RentalData();
    this.AgentDetails();
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

  keyup(event) {
    if (this.AddEditForm.controls.phone_number.status === 'INVALID') {
      if (this.AddEditForm.controls.phone_number.value.length < 21) {
        this.numberErr = false;
      } else {
        this.numberErr = true;
      }
    } else {
      this.numberErr = false;
    }
    if (this.submitted === true) {
      this.numberErr = false;
    }
  }

}
