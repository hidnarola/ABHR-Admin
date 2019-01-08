import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rental-history',
  templateUrl: './rental-history.component.html',
  styleUrls: ['./rental-history.component.css']
})
export class RentalHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public rentalData;
  public userId;
  constructor(
    private route: ActivatedRoute,
    public renderer: Renderer,
    private service: CrudService,
    private dataShare: DataSharingService,
    ) {
    this.route.params.subscribe(params => { this.userId = params.id; });
    console.log('userId in rentals==>', this.userId);
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
  ngOnInit() {
    this.RentalData();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  RentalData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      language: {'processing': '<i class="fa fa-refresh loader fa-spin"></i>'},
      ajax: (dataTablesParameters: any, callback) => {
        console.log('dataparametes in rental==>', dataTablesParameters);
        setTimeout(() => {
          dataTablesParameters.user_id = this.userId;
          this.service.post('admin/user/rented_list', dataTablesParameters).subscribe(res => {
            console.log('res in rental', res);
          this.rentalData = res['result']['data'];
          this.dataShare.changeLoading(false);
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
          data: 'Contract No.',
          name: 'booking_number'
        },
        // {
        //   data: 'Client Name',
        //   name: 'userId.first_name',
        // },
        // {
        //   data: 'Price',
        //   name: 'booking_rent',
        // },
        {
          data: 'Start Of Rent',
          name: 'from_time',
        },
        {
          data: 'End Of Rent',
          name: 'to_time',
        }
      ]
    };
  }

}
