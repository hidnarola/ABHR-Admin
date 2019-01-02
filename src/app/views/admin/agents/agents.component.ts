import { Component, OnInit, Renderer, ViewChild, AfterViewInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDialogService } from 'ngx-modal-dialog';

// model
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// primng
import { ConfirmationService, Message } from 'primeng/api';
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
  public formData: any;
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  isLoading: boolean;
  public agents;
  closeResult: string;
  public title = 'Add Agent';

  private subscription: Subscription;
  message: any;

  msgs: Message[] = [];

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    // model
    private modalService: NgbModal,
    private fromBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    // modalService: ModalDialogService,
    viewRef: ViewContainerRef
  ) {
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.fromBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      // deviceType: ['', Validators.required],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^([0-9]){10}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });

    this.formData = {
      first_name: String,
      last_name: String,
      // deviceType: String,
      phone_number: Number,
      email: String
    };
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
        this.title = 'Edit Agent';
        console.log('userId', this.userId);
        this.service.put('admin/agents/update', this.formData).subscribe(res => {
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      } else {
        this.title = 'Add Agent';
        this.service.post('admin/agents/add', this.formData).subscribe(res => {
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['error'] });
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
  }

  // public agentData = data;

  ngOnInit() {
    this.AgentsListData();
  }

  AgentsListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[4, 'desc']],
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/agents/list', dataTablesParameters).subscribe(res => {
            this.agents = res['result']['data'];
            console.log(this.agents);
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
      message: 'Are you sure want to delete this record?',
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
