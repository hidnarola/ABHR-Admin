import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../shared/services/crud.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as io from 'socket.io-client';
import { cc } from '../../../shared/constant/country_code';
import { environment } from '../../../../environments/environment';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})

@NgModule({
  imports: [],
  exports: [RouterModule]
})

export class AgentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddEditForm: FormGroup;
  submitted = false;
  isCols: boolean;
  public formData: any;
  public emailData: any;
  public phoneData: any;
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  isLoading: boolean;
  public agents;
  closeResult: string;
  public title = 'Add Agent';
  public pageNumber;
  public totalRecords;
  public errMsg;
  public phoneErrMsg;
  public numberErr: boolean = false;
  hideSpinner: boolean;
  private socket;
  public countryCode: SelectItem[];
  selectedCc: string;
  public modalData;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.hideSpinner = true;
    // addform validation
    const pattern = new RegExp('^\\ *([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})\\ *$');
    this.AddEditForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+$'), this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z]+$'), this.noWhitespaceValidator])],
      phone_number: ['', Validators.compose([Validators.pattern('^[0-9]{10,20}$'), this.uniquePhoneValidator])],
      country_code: [''],
      email: ['', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.email,
      Validators.pattern(pattern), this.uniqueEmailValidator])],
    });

    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      country_code: Number,
      email: String
    };
    this.countryCode = cc;
  }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
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
  get f() { return this.AddEditForm.controls; }

  closePopup() {
    const element = document.getElementById('closepopup');
    if (element !== null) {
      element.click();
    }
    this.isLoading = false;
  }
  closeDeletePopup() {
    const data: HTMLCollection = document.getElementsByClassName('ui-button');
    if (data.length > 0) {
      console.log('l => ', data[1]);
      const ele: any = data[1];
      ele.click();
    }
  }
  // model
  open2(content, item) {
    console.log('item => ', item);
    this.modalData = content;
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Agent';
      this.isEdit = true;
      this.userId = item._id;
      this.AddEditForm.controls['first_name'].setValue(item.first_name);
      this.AddEditForm.controls['last_name'].setValue(item.last_name);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
      this.AddEditForm.controls['country_code'].setValue(item.country_code);
      //    this.AddEditForm.controls['deviceType'].setValue(item.deviceType);
    } else {
      this.title = 'Add Agent';
      console.log('this.addeditform => ', this.AddEditForm.value.country_code);
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason === 'Cross click' || reason === 0) {
        this.isEdit = false;
        this.AddEditForm.controls['first_name'].setValue('');
        this.AddEditForm.controls['last_name'].setValue('');
        this.AddEditForm.controls['email'].setValue('');
        this.AddEditForm.controls['phone_number'].setValue('');
        this.AddEditForm.controls['country_code'].setValue('971');
        // this.AddEditForm.controls['deviceType'].setValue('');
      }
    });
    this.submitted = false;
    this.isLoading = false;
    this.numberErr = false;
  }
  // add-edit popup ends here


  onSubmit() {
    console.log('this.AddEditForm => ', this.AddEditForm);
    this.submitted = true;
    this.numberErr = false;
    if (!this.AddEditForm.invalid) {
      console.log('this.AddEditForm => ', this.AddEditForm);
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      if (this.formData.phone_number !== null) {
        this.formData.phone_number = this.formData.phone_number.trim();
      } else {
        this.formData.country_code = null;
        console.log('this.formData.country_code => ', this.formData.country_code);
      }
      console.log('this.formData => ', this.formData);
      this.isLoading = true;
      if (this.isEdit) {
        this.formData.user_id = this.userId;
        this.title = 'Edit Agent';
        this.service.put('admin/agents/update', this.formData).subscribe(res => {
          this.isLoading = false;
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          console.log(' err[message] => ', err['message']);
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      } else {
        this.title = 'Add Agent';
        console.log('formdata in add form => ', this.formData);
        this.service.post('admin/agents/add', this.formData).subscribe(res => {
          this.isLoading = false;
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      }
      this.isEdit = false;
      this.submitted = false;
    } else {
      this.isLoading = false;
      return;
    }
  }

  // ends here

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    console.log('this.modalData on destroy => ', this.modalData);
    if (this.modalData !== undefined) {
      this.closePopup();
    }
    this.closeDeletePopup();
  }

  ngOnInit() {
    this.isCols = true;
    this.AgentsListData();
    this.socket = io.connect(environment.socketUrl);
  }


  AgentsListData() {
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
      responsive: true,
      destroy: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        setTimeout(() => {
          this.service.post('admin/agents/list', dataTablesParameters).subscribe(async (res: any) => {
            this.agents = await res['result']['data'];
            console.log('this.agents => ', this.agents);
            // this.agents = [];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.agents.length > 0) {
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
          data: 'First Name',
          name: 'first_name',
        },
        {
          data: 'Last Name',
          name: 'last_name',
        },
        {
          data: 'Email',
          name: 'email',
        },
        // {
        //   data: 'Device Type',
        //   name: 'deviceType',
        // },
        {
          data: 'Phone Number',
          name: 'phone_number',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        },
      ]
    };
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 4) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  checkKeyPress(event) { }





  // dlt popup
  delete(userId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/agents/delete', { user_id: userId }).subscribe(res => {
          this.socket.emit('DeleteAgent', {
            'agent_id': userId,
          });
          this.render();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      },
      reject: () => { }
    });
  }
  // dlt pop up ends here

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
