import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// model
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// primng
import { ConfirmationService, Message } from 'primeng/api';

// alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-car-rental-companies',
  templateUrl: './car-rental-companies.component.html',
  styleUrls: ['./car-rental-companies.component.css']
})
export class CarRentalCompaniesComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public title = 'Add Company';
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  public users;
  private subscription: Subscription;
  checked: boolean;
  message: any;
  msgs: Message[] = [];
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
    private fromBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.fromBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      site_url: ['', [Validators.required, Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')]],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });

    this.formData = {
      name: String,
      description: String,
      phone_number: Number,
      email: String,
      site_url: String
    };
  }
  get f() { return this.AddEditForm.controls; }
  UsersListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[5, 'desc']],
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          console.log('dtaparametes car rental company==>', dataTablesParameters);
          this.service.post('admin/company/list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            console.log(this.users);
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
          data: 'Company Name',
          name: 'name',
        },
        {
          data: 'Description',
          name: 'description',
        },
        {
          data: 'Email',
          name: 'email',
        },
        {
          data: 'Site URl',
          name: 'site_url',
        },
        {
          data: 'Phone Number',
          name: 'phone_number',
        }, {
          data: 'Status',
          name: 'status',
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

  // Add-Edit pop up
  open2(content, item) {
    console.log('item==>', item);
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Company';
      this.isEdit = true;
      console.log('title', this.title);
      this.userId = item._id;
      this.AddEditForm.controls['name'].setValue(item.name);
      this.AddEditForm.controls['description'].setValue(item.description);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['site_url'].setValue(item.site_url);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
    } else {
      this.title = 'Add Company';
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
        this.AddEditForm.controls['name'].setValue('');
        this.AddEditForm.controls['description'].setValue('');
        this.AddEditForm.controls['email'].setValue('');
        this.AddEditForm.controls['site_url'].setValue('');
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
      message: 'Are you sure want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/company/delete', { company_id: userId }).subscribe(res => {
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

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }

  handleChange(e, id) {
    console.log(e);
    console.log('comp id => ', id);
    const params = {
      company_id: id,
      status: e.checked
    };
    this.service.post('admin/company/change_status', params)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status change succesfully' });
      }, error => {
        console.log(error);
        e.checked = !e.checked;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      console.log('formadata==>', this.formData);
      if (this.isEdit) {
        this.formData.company_id = this.userId;
        this.title = 'Edit Company';
        console.log('userId', this.userId);
        this.service.put('admin/company/update', this.formData).subscribe(res => {
          console.log('after update==>', res);
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      } else {
        this.title = 'Add Company';
        this.service.post('admin/company/add', this.formData).subscribe(res => {
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
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

  ngOnInit() {
    this.UsersListData();
  }

}
