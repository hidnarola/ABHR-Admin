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
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },

        ajax: (dataTablesParameters: any, callback) => {
          this.pageNumber = dataTablesParameters.length;
          this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          setTimeout(() => {
            // if (filterBy) { dataTablesParameters['filtered_by'] = filterBy; }
            if (this.DDfilter !== '') {
              dataTablesParameters['filtered_by'] = this.DDfilter;
            }
            console.log('dtaparametes car==>', dataTablesParameters);
            this.service.post('admin/user/list', dataTablesParameters).subscribe(res => {
              this.users = res['result']['data'];
              this.totalRecords = res['result']['recordsTotal'];
              // this.users = [];
              if (this.users.length > 0) {
                this.isCols = true;
                $('.dataTables_wrapper').css('display', 'block');
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
    } catch (error) {
      console.log('error => ', error);
    }

  }

  getUserListData(params) {
    this.spinner.show();
    this.service.post('admin/user/list', params).subscribe(res => {
      this.users = res['result']['data'];
      console.log(this.users);
      this.spinner.hide();

    });
  }

  changeFilterOptionHandler(e) {
    console.log('this.DDfilter => ', this.DDfilter);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
    // console.log('value => ', e.target.value);
    // const params = this.dtparams;
    // params.filtered_by = e.target.value;
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   // Destroy the table first
    //   dtInstance.destroy();
    //   this.UsersListData(e.target.value);
    // });
    // // this.getUserListData(params);
  }

  ngOnInit() {
    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
      const str = (data[5]) || ''; // use data for the filter column
      if (str === this.DDfilter) {
        return true;
      }
      return false;
    });
    // this.items = [{
    //   items: [
    //     { label: 'View Details', icon: 'mdi mdi-text-subject' },
    //     { label: 'Rental History', icon: 'mdi mdi-text-subject' }
    //   ]
    // }];
    this.UsersListData();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
