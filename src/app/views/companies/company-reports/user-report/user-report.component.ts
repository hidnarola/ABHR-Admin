import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public reports;
  // Data table parameters
  // dtparams: any;
  // DDfilter = '';

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.ReportData();
  }

  ReportData() {
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
          // this.dtparams = dataTablesParameters;
          dataTablesParameters['columns'][3]['isNumber'] = true;
          dataTablesParameters['columns'][4]['isNumber'] = true;
          setTimeout(() => {
            // if (filterBy) { dataTablesParameters['filtered_by'] = filterBy; }
            // if (this.DDfilter !== '') {
            //   dataTablesParameters['filtered_by'] = this.DDfilter;
            // }
            this.service.post('admin/user/report_list', dataTablesParameters).subscribe(res => {
              this.reports = res['result']['data'];
              console.log('response in reports', res);
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
            data: 'Car Brand',
            name: 'car_brand',
          },
          {
            data: 'Car Modal',
            name: 'car_modal',
          },
          {
            data: 'Compnay Name',
            name: 'company_name',
          },
          {
            data: 'No Of Rented',
            name: 'no_of_rented',
          },
          {
            data: 'Total Rent',
            name: 'totalrent',
          },
        ]
      };
    } catch (error) {
      console.log('error => ', error);
    }

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
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

}
