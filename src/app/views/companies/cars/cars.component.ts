import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
//service
import { DataSharingService } from '../../../shared/services/data-sharing.service'
import { CrudService } from '../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
//popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//model
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//primng
import {ConfirmationService, Message} from 'primeng/api';
//alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  public users;
  public companyId;
  private subscription: Subscription;
  message: any;
  msgs: Message[] = [];
  closeResult: string;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    // private modalService: NgbModal,
    // private fromBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) {
    let company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    console.log('companyid==>', this.companyId)
  }

  UsersListData(){
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: false,
      language: { "processing": "<i class='fa fa-refresh loader fa-spin'></i>" },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          dataTablesParameters.company_id = this.companyId; 
          console.log('dtaparametes car==>',dataTablesParameters);
          this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            console.log(this.users);
            this.spinner.hide();
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
          })
        }, 1000)
      },
      columns: [
        {
          data: 'Id',
        },
        {
          data: 'Brand Name',
          name: 'brandDetails.brand_name',
        },
        // {
        //   data: 'Model Name',
        //   name: 'car_model',
        // },
        {
          data: 'Year', 
          name: 'car_model_release_year',
        },
        {
          data: 'Available',
          name: 'is_avialable',
        },
        {
          data: 'Actions',
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

//dlt popup
delete(userId) {
  console.log('userId==>',userId);
  this.confirmationService.confirm({
      message: 'Are you sure want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      this.service.put('admin/company/delete', {company_id : userId}).subscribe(res => {
        this.render();
        this.messageService.add({severity:'success', summary:'Success', detail: res['message']});
        //setTimeout(()=>{ this.closePopup()},1000);
      },err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message']});        
      });
      },
      reject: () => {
    }
  });
}
// dlt pop up ends here

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

closePopup() {
  var element = document.getElementById('closepopup');
  element.click();
}

onSubmit() {}

ngOnInit() {
  this.UsersListData();
}

}
