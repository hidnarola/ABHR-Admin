import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public users;

  // Data table parameters
  dtparams: any;
  DDfilter = '';
  isCols: boolean;
  public pageNumber;
  public totalRecords;

  // items: MenuItem[];

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
  ) { }

  UsersListData() {
    try {
      this.spinner.show();

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        destroy: true,
        processing: true,
        serverSide: true,
        ordering: true,
        order: [[3, 'desc']],
        language: { 'processing': '' },
        // scrollX: true,
        responsive: true,
        // scrollCollapse: true,
        autoWidth: false,
        initComplete: function (settings, json) {
          $('.custom-datatable').wrap('<div style="overflow:auto; width:100%;position:relative;"></div>');
        },
        ajax: (dataTablesParameters: any, callback) => {
          this.pageNumber = dataTablesParameters.length;
          this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          setTimeout(() => {
            if (this.DDfilter !== '') {
              dataTablesParameters['filtered_by'] = this.DDfilter;
            }
            this.service.post('admin/user/list', dataTablesParameters).subscribe(res => {
              this.users = res['result']['data'];
              // this.users = [];
              this.totalRecords = res['result']['recordsTotal'];

              if (this.users.length > 0) {
                this.isCols = true;
                $('.dataTables_wrapper').css('display', 'block');
              }
              else {
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
            data: 'Member Since',
            name: 'createdAt',
          },
          {
            data: 'No Of Rentals',
            name: 'count',
          },
          {
            data: 'Status',
            name: 'app_user_status',
          },
          {
            data: 'Actions',
            orderable: false
          }
        ]
      };
    } catch (error) { }

  }

  getUserListData(params) {
    this.spinner.show();
    this.service.post('admin/user/list', params).subscribe(res => {
      this.users = res['result']['data'];
      this.spinner.hide();

    });
  }

  changeFilterOptionHandler(e) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ngOnInit() {
    this.isCols = true;
    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
      const str = (data[5]) || ''; // use data for the filter column
      if (str === this.DDfilter) {
        return true;
      }
      return false;
    });
    this.UsersListData();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let table: any = $('.custom-datatable').DataTable();
    table.columns().iterator('column', function (ctx, idx) {
      if (idx !== 6) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
      }
    });
  }

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
    this.dtTrigger.unsubscribe();
  }

}
