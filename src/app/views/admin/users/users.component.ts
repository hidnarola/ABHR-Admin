import { Component, OnInit, Renderer, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public users;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
  ) { }

  UsersListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: false,
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          console.log('dtaparametes car==>', dataTablesParameters);
          this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
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
          data: 'Name',
          name: '',
        },
        {
          data: 'Email',
          name: '',
        },
        {
          data: 'Member Since',
          name: '',
        },
        {
          data: 'No Of Rentals',
          name: '',
        },
        {
          data: 'Actions',
        }
      ]
    };
  }

  ngOnInit() {
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

  ngDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
