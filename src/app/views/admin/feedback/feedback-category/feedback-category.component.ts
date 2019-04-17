import { Component, OnInit, ViewChild, Renderer, OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feedback-category',
  templateUrl: './feedback-category.component.html',
  styleUrls: ['./feedback-category.component.css']
})
export class FeedbackCategoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  hideSpinner: boolean;
  isCols: boolean;
  public isEdit: boolean;
  isLoading: boolean;
  AddEditForm: FormGroup;
  submitted = false;
  public pageNumber;
  public totalRecords;
  public categories;
  public formData: any;
  public title = 'Add Category';
  closeResult: string;
  public Id;
  public modalData;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.AddEditForm = this.formBuilder.group({
      category_name: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });

    this.formData = {
      category_name: String,
    };
  }
  // add-edit-popup form validation
  get f() { return this.AddEditForm.controls; }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  // model
  open2(content, item) {
    this.modalData = content;
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Category';
      this.isEdit = true;
      this.Id = item._id;
      this.AddEditForm.controls['category_name'].setValue(item.category_name);
    } else {
      this.title = 'Add Category';
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
        this.AddEditForm.controls['category_name'].setValue('');
      }
    });
    this.submitted = false;
    this.isLoading = false;
  }
  // add-edit popup ends here

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
      const ele: any = data[1];
      ele.click();
    }
  }

  // dlt popup
  delete(Id) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/reports/delete/category', { category_id: Id }).subscribe(res => {
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

  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.formData = this.AddEditForm.value;
      this.formData.category_name = this.formData.category_name.trim();
      this.isLoading = true;
      if (this.isEdit) {
        this.formData.category_id = this.Id;
        this.title = 'Edit Category';
        this.service.post('admin/reports/update/category', this.formData).subscribe(res => {
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
        this.title = 'Add Category';
        this.service.post('admin/reports/add/category', this.formData).subscribe(res => {
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

  CategoryListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[1, 'desc']],
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
          this.service.post('admin/reports/category_list', dataTablesParameters).subscribe(async (res: any) => {
            this.categories = await res['result']['data'];
            // this.categories = [];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.categories.length > 0) {
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
          data: 'Category Name',
          name: 'category_name',
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        },
      ]
    };
  }

  ngOnInit() {
    this.isCols = true;
    this.CategoryListData();
  }
  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.modalData !== undefined) {
      this.closePopup();
    }
    this.closeDeletePopup();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 1) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

}
