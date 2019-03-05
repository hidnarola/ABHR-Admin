import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
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

  ReportListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      // order: [[4, 'desc']],
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
        // {
        //   data: 'Actions',
        //   name: 'createdAt',
        //   orderable: false
        // },
      ]
    };
  }

  ngOnInit() {
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
      $(table.column(idx).header()).append('<span class="sort-icon"/>');
      // if (idx !== 4) {
      //   $(table.column(idx).header()).append('<span class="sort-icon"/>');
      // }
    });
  }


}
