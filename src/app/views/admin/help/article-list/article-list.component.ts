import { Component, OnInit, Injectable, AfterViewInit, OnDestroy, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})

@Injectable()
export class ArticleListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  isCols: boolean;
  public pageNumber;
  public totalRecords;
  public articleData;
  hideSpinner: boolean;

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
  ) { }


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
    this.closeDeletePopup();
  }


  ngOnInit() {
    this.isCols = true;
    this.articleListData();
  }

  articleListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[1, 'desc']],
      language: {
        'processing': '',
      },
      destroy: true,
      // scrollX: true,
      // scrollCollapse: true,
      autoWidth: false,
      initComplete: function (settings, json) {
        $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][1]['isNumber'] = true;
        setTimeout(() => {
          this.service.post('admin/help/list', dataTablesParameters).subscribe(res => {
            this.articleData = res['result']['data'];
            // this.articleData = [];
            this.totalRecords = res['result']['recordsTotal'];
            if (this.articleData.length > 0) {
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
          data: 'Topic',
          name: 'topic',
        },
        // {
        //   data: 'Description',
        //   name: 'description',
        // },
        {
          data: 'CreatedAt',
          name: 'createdAt',
        },
        {
          data: 'Actions',
          orderable: false
        }
      ]
    };
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 2) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  // dlt popup
  delete(userId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.spinner.show();
        this.service.put('admin/help/delete', { article_id: userId }).subscribe(res => {
          this.render();
          this.spinner.hide();
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

  closeDeletePopup() {
    const data: HTMLCollection = document.getElementsByClassName('ui-button');
    if (data.length > 0) {
      console.log('l => ', data[1]);
      const ele: any = data[1];
      ele.click();
    }
  }

}
