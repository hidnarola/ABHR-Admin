// import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
// import { Subject } from 'rxjs';
// import { DataTableDirective } from 'angular-datatables';

// import { NgxSpinnerService } from 'ngx-spinner';
// import { CrudService } from '../../../../shared/services/crud.service';

// @Component({
//   selector: 'app-user-detail',
//   templateUrl: './user-detail.component.html',
//   styleUrls: ['./user-detail.component.css']
// })
// export class UserDetailComponent implements OnInit, OnDestroy, AfterViewInit {

//   public rentalData;

//   @ViewChild(DataTableDirective)
//   dtElement: DataTableDirective;
//   dtOptions: DataTables.Settings = {};
//   dtTrigger: Subject<any> = new Subject();

//   constructor(
//     public renderer: Renderer,
//     private spinner: NgxSpinnerService,
//     private service: CrudService,
//   ) { }

//   ngOnInit() {
//   }
//   RentalData() {
//     this.spinner.show();
//     this.dtOptions = {
//       pagingType: 'full_numbers',
//       pageLength: 10,
//       processing: true,
//       serverSide: true,
//       ordering: true,
//       language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
//       ajax: (dataTablesParameters: any, callback) => {
//         console.log('dataparametes==>', dataTablesParameters);
//         setTimeout(() => {
//           this.service.post('admin/agents/rental_list', dataTablesParameters).subscribe(res => {
//             console.log('rentals res in agents', res);
//             this.rentalData = res['result']['data'];
//             // this.dataShare.changeLoading(false);
//             this.spinner.hide();
//             callback({
//               recordsTotal: res['result']['recordsTotal'],
//               recordsFiltered: res['result']['recordsTotal'],
//               data: []
//             });
//           });
//         }, 1000);
//       },
//       columns: [
//         {
//           data: 'Contract No.',
//           name: 'booking_number'
//         },
//         {
//           data: 'Client Name',
//           name: 'userId.first_name',
//         },
//         {
//           data: 'Price',
//           name: 'booking_rent',
//         },
//         {
//           data: 'Start Of Rent',
//           name: 'from_time  | date:"MM/dd/yy" ',
//         },
//         {
//           data: 'End Of Rent',
//           name: 'to_time  | date:"MM/dd/yy"  ',
//         }
//       ]
//     };
//   }

//   render(): void {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       // Destroy the table first
//       dtInstance.destroy();
//       // Call the dtTrigger to rerender again
//       this.dtTrigger.next();
//     });
//   }

//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//   }

//   ngAfterViewInit(): void {
//     this.dtTrigger.next();
//   }

// }
