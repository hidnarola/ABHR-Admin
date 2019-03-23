import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reported-cars',
  templateUrl: './reported-cars.component.html',
  styleUrls: ['./reported-cars.component.css']
})
export class ReportedCarsComponent implements OnInit, OnDestroy, AfterViewInit {

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
  public report;
  public formData: any;
  public title = 'Add Report';
  closeResult: string;
  public Id;
  public reportStatus;
  display: boolean = false;
  public reportId;
  resolvedMessageForm: FormGroup;

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
    this.resolvedMessageForm = this.formBuilder.group({
      resolved_message: ['', Validators.required]
    });
    this.formData = {
      resolved_message: String,
    };
  }
  get f() { return this.resolvedMessageForm.controls; }


  // showDialog(event, id) {
  //   console.log('event => ', event);
  //   console.log('id => ', id);
  //   console.log('this.report => ', this.report);
  //   this.display = true;
  //   this.resolvedMessageForm.controls['resolved_message'].setValue('');
  //   this.submitted = false;
  // }

  ReportListData() {
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
          dataTablesParameters['columns'][0]['isNumber'] = true;
          this.service.post('admin/reports/list', dataTablesParameters).subscribe(async (res: any) => {
            console.log('res => ', res);
            this.report = await res['result']['data'];
            // this.categories = [];
            console.log('this.reports => ', this.report);
            this.totalRecords = res['result']['recordsTotal'];
            if (this.report.length > 0) {
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
          data: 'Booking Number',
          name: 'booking_number',
        },
        {
          data: 'Category Type',
          name: 'category_type',
        },
        {
          data: 'Report Message',
          name: 'report_message',
        },
        {
          data: 'Status',
          name: 'status',
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
    this.ReportListData();
  }

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.hideSpinner = false;
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      // $(table.column(idx).header()).append('<span class="sort-icon"/>');
      if (idx !== 4) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  onChangeStatus = (e, Id) => {
    console.log('Id => ', Id);
    console.log('e => ', e);
    this.reportId = Id;
    if (e === true) {
      console.log('true => ');
      this.display = true;
      this.resolvedMessageForm.controls['resolved_message'].setValue('');
      this.submitted = false;
    } else {
      console.log('else => ');
      this.reportStatus = 'pending';
      var Obj = {
        report_id: Id,
        status: this.reportStatus
      };
      console.log('Obj => ', Obj);
      this.service.post('admin/reports/change_status', Obj).subscribe(res => {
        console.log('res => ', res);
        this.render();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      });
    }
  }
  cancel() {
    this.display = false;
    this.reportStatus = 'pending';
    this.render();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.resolvedMessageForm.invalid) {
      this.isLoading = true;
      console.log('this.resolvedMessageForm => ', this.resolvedMessageForm.value.resolved_message);
      var obj = {
        report_id: this.reportId,
        status: 'resolved',
        resolved_message: this.resolvedMessageForm.value.resolved_message
      };
      console.log('Obj => ', obj);
      this.service.post('admin/reports/change_status', obj).subscribe(res => {
        console.log('res => ', res['status']);
        if (res['status'] === 'success') {
          this.reportStatus = 'resolved';
        }
        // this.reportStatus = 'resolved';
        this.display = false;
        this.submitted = false;
        this.isLoading = false;
        this.render();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        this.display = false;
        this.submitted = false;
        this.isLoading = false;
      });
      this.submitted = false;
      this.resolvedMessageForm.controls['resolved_message'].setValue('');
    }

  }


  //     this.submitted = false;
  // this.resolvedMessageForm.controls['old_password'].setValue('');

}
