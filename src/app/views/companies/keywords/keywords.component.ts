import { Component, OnInit, Renderer, ViewChild, AfterViewInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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

const KeywordsRoutes: Routes = [];

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})

@NgModule({
  imports: [RouterModule.forChild(KeywordsRoutes)],
  exports: [RouterModule]
})

export class KeywordsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public Id;
  public isEdit: boolean;
  public isDelete: boolean;
  isLoading: boolean;
  public keywords;
  closeResult: string;
  public title = 'Add Keywords';

  private subscription: Subscription;
  message: any;

  msgs: Message[] = [];

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    // public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    // model
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    // modalService: ModalDialogService,
    viewRef: ViewContainerRef
  ) {
    console.log("i am here");
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.formBuilder.group({
      keyword: ['', Validators.required],
      english: ['', Validators.required],
      arabic: ['', [Validators.required]]
    });

    this.formData = {
      keyword: String,
      english: String,
      arabic: String,

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
        this.formData.keyword_id = this.Id;
        this.title = 'Edit Keywords';
        console.log('Id', this.Id);
        this.service.put('admin/keyword/edit', this.formData).subscribe(res => {
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
        this.title = 'Add Keywords';
        this.service.post('admin/keyword/save', this.formData).subscribe(res => {
          this.isLoading = false;
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.isLoading = false;
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
    this.KeywordsListData();
  }

  KeywordsListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[3, 'desc']],
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/keyword/list', dataTablesParameters).subscribe(res => {
            console.log(res['result']);
            this.keywords = res['result']['data'];
            console.log(this.keywords);
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
          data: 'Keyword',
          name: 'keyword',
        },
        {
          data: 'English',
          name: 'english',
        },
        {
          data: 'Arabic',
          name: 'arabic',
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
      this.title = 'Edit Keywords';
      this.isEdit = true;
      this.Id = item._id;
      this.AddEditForm.controls['keyword'].setValue(item.keyword);
      this.AddEditForm.controls['english'].setValue(item.english);
      this.AddEditForm.controls['arabic'].setValue(item.arabic)
    } else {
      this.title = 'Add Keywords';
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
        this.AddEditForm.controls['keyword'].setValue('');
        this.AddEditForm.controls['english'].setValue('');
        this.AddEditForm.controls['arabic'].setValue('');

      }
    });
    this.submitted = false;
  }
  // add-edit popup ends here

  // dlt popup
  delete(Id) {
    console.log('userId==>', Id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/keyword/delete', { keyword_id: Id }).subscribe(res => {
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
