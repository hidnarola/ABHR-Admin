import { Component, OnInit, Renderer, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CrudService } from '../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-taken-away-cars',
  templateUrl: './taken-away-cars.component.html',
  styleUrls: ['./taken-away-cars.component.css']
})
export class TakenAwayCarsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  isCols: boolean;
  public pageNumber;
  public totalRecords;
  public carData;
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
  }


  ngOnInit() {
    this.carDataListData();
  }

  carDataListData() {
    console.log('this.hideSpinner => ', this.hideSpinner);
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      ordering: true,
      order: [[4, 'desc']],
      language: {
        'processing': '',
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.pageNumber = dataTablesParameters.length;
        dataTablesParameters['columns'][1]['isNumber'] = true;
        setTimeout(() => {
          console.log('dtaparametes==>', dataTablesParameters);
          this.service.post('admin/tracking/returning', dataTablesParameters).subscribe(res => {
            this.carData = res['result']['data'];
            // this.carData = [];
            this.totalRecords = res['result']['recordsTotal'];
            console.log('res => ', res);
            if (this.carData.length > 0) {
              this.isCols = true;
              $('.dataTables_wrapper').css('display', 'block');
            }
            console.log('total records===>', this.totalRecords);
            console.log('page number', this.pageNumber);
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
          data: 'Id',
          name: '_id',
        },
        {
          data: 'Booking Number',
          name: 'booking_number',
        },
        {
          data: 'First Name',
          name: 'agent_first_name',
        },
        {
          data: 'Last Name',
          name: 'agent_last_name',
        },
        {
          data: 'Model Name',
          name: 'model_name',
        },
        {
          data: 'Brand Name',
          name: 'brand_name',
        },
        {
          data: 'From Time',
          name: 'from_time',
        },
        {
          data: 'To Time',
          name: 'to_time',
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
    this.hideSpinner = false;
  }
}
