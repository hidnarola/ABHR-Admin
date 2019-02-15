import { Component, OnInit, Renderer, ViewChild, AfterViewInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

// model
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

// primng
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


const AgentRoutes: Routes = [];

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})

@NgModule({
  imports: [RouterModule.forChild(AgentRoutes)],
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
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  isLoading: boolean;
  public agents;
  closeResult: string;
  public title = 'Add Agent';
  public pageNumber;
  public totalRecords;

  private subscription: Subscription;
  hideSpinner: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
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
      first_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      last_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      phone_number: ['', Validators.compose([Validators.pattern('\\ *[0-9]{10}\\ *')])],
      email: ['', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.email,
      Validators.pattern(pattern), this.uniqueEmailValidator])],
    });

    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      email: String
    };
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
  get f() { return this.AddEditForm.controls; }

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      this.formData.email = this.formData.email.trim();
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      this.formData.phone_number = this.formData.phone_number.trim();
      console.log('formadata==>', this.formData);
      if (this.isEdit) {
        this.formData.user_id = this.userId;
        this.title = 'Edit Agent';
        console.log('userId', this.userId);
        this.service.put('admin/agents/update', this.formData).subscribe(res => {
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
      } else {
        this.title = 'Add Agent';
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
      return;
    }
  }

  // ends here

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // this.dtOptions = {
      //   language: {
      //     processing: '<i class= "fa fa-refresh loader fa-spin"></i>'
      //   }
      // };
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // public agentData = data;

  ngOnInit() {

    this.AgentsListData();
  }

  AgentsListData() {
    console.log('this.hideSpinner => ', this.hideSpinner);
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[4, 'desc']],
      // language: {},
      language: {
        'processing': '',
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/agents/list', dataTablesParameters).subscribe(async (res: any) => {
            this.agents = await res['result']['data'];
            this.totalRecords = res['result']['recordsTotal'];
            // this.agents = [];
            if (this.agents.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            console.log('total records===>', this.totalRecords);
            console.log('page number', this.pageNumber);
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
  }

  // model
  open2(content, item) {
    console.log('item==>', item);
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Agent';
      this.isEdit = true;
      this.userId = item._id;
      this.AddEditForm.controls['first_name'].setValue(item.first_name);
      this.AddEditForm.controls['last_name'].setValue(item.last_name);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
      //    this.AddEditForm.controls['deviceType'].setValue(item.deviceType);
    } else {
      this.title = 'Add Agent';
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
        // this.AddEditForm.controls['deviceType'].setValue('');
      }
    });
    this.submitted = false;
  }
  // add-edit popup ends here

  // dlt popup
  delete(userId) {
    console.log('userId==>', userId);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/agents/delete', { user_id: userId }).subscribe(res => {
          this.render();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      },
      reject: () => {
      }
    });
  }
  // dlt pop up ends here
}
