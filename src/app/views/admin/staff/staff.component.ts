import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// model
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// primng
import { ConfirmationService, Message } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

// alert
import { AlertService } from '../../../shared/services/alert.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public emailData: any;
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  public users;
  private subscription: Subscription;
  message: any;
  msgs: Message[] = [];
  public title = 'Add Staff';
  // model
  closeResult: string;
  isLoading: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    // model
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])]
    });

    this.formData = {
      first_name: String,
      last_name: String,
      // deviceType: String,
      phone_number: Number,
      email: String
    };
  }

  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace;
    if (isWhitespace = (control.value || '').trim().length === 0) {
      return { 'required': true };
    } else {
      const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = { 'email': control.value };
        if (this.isEdit) {
          this.emailData = { 'email': control.value, 'user_id': this.userId };
        }
        console.log('emailData===>', this.emailData);
        return this.service.post('admin/checkemail', this.emailData).subscribe(res => {
          // return (res['status'] === 'success') ? {'unique': true} : null;
          // console.log('response of validation APi', res['status']);
          // if (res['status'] === 'success') {
          //   console.log('if==>');
          // } else {
          //   console.log('else==>');
          // }
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
      console.log('formadata==>', this.formData);
      if (this.isEdit) {
        this.formData.user_id = this.userId;
        this.title = 'Edit Staff';
        console.log('userId in staff', this.userId);
        this.service.put('admin/staff/update', this.formData).subscribe(res => {
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
        this.title = 'Add Staff';
        console.log('formdata in add==>', this.formData);
        this.service.post('admin/staff/add', this.formData).subscribe(res => {
          this.isLoading = false;
          console.log('staff adddata==>', res);
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
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    // this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.UsersListData();
  }

  UsersListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[4, 'desc']],
      language: { 'processing': '<i class=\'fa fa-refresh loader fa-spin\'></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/staff/list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            console.log(this.users);
            // this.dataShare.changeLoading(false);
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
        {
          data: 'Phone Number',
          name: 'phone_number',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        }
      ]
    };
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  open2(content, item) {
    console.log('item==>', item);
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Staff';
      this.isEdit = true;
      this.userId = item._id;
      this.AddEditForm.controls['first_name'].setValue(item.first_name);
      this.AddEditForm.controls['last_name'].setValue(item.last_name);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
    } else {
      this.title = 'Add Staff';
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
        this.service.put('admin/staff/delete', { user_id: userId }).subscribe(res => {
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
