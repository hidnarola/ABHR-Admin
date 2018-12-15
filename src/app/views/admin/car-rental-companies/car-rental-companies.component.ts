import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

//routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

//service
import { DataSharingService } from '../../../shared/services/data-sharing.service'
import { CrudService } from '../../../shared/services/crud.service';

//popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//model
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//primng
import {ConfirmationService, Message} from 'primeng/api';

//alert
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-car-rental-companies',
  templateUrl: './car-rental-companies.component.html',
  styleUrls: ['./car-rental-companies.component.css']
})
export class CarRentalCompaniesComponent implements OnInit {
  
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
  private subscription: Subscription;
  message: any;
  msgs: Message[] = [];

constructor(
  public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    //model
    private modalService: NgbModal,
    private fromBuilder: FormBuilder,
    private alertService : AlertService
) {
  //addform validation
  const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
  this.AddEditForm = this.fromBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    site_url: [''],
    phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
  });

  this.formData = {
    name: String,
    description: String,
    phone_number: Number,
    email: String,
    site_url: String
  };
}
get f() { return this.AddEditForm.controls; }
UsersListData(){
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    serverSide: true,
    ordering: true,
    language: { "processing": "<i class='fa fa-refresh loader fa-spin'></i>" },
    ajax: (dataTablesParameters: any, callback) => {
      setTimeout(() => {
        console.log('dtaparametes car rental company==>',dataTablesParameters);
        this.service.post('admin/company/list', dataTablesParameters).subscribe(res => {
          this.users = res['result']['data'];
          console.log(this.users);
          this.dataShare.changeLoading(false);
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
        data: 'Company Name',
        name: 'name',
      },
      {
        data: 'Description',
        name: 'description',
      },
      {
        data: 'Email',
        name: 'email',
      },
      {
        data: 'Site URl',
        name: 'site_url',
      },
      {
        data: 'Phone Number',
        name: 'phone_number',
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

//Add-Edit pop up
closeResult: string;
open2(content, item) {
  console.log('item==>', item);
  if (item != 'undefined' && item != '') {
    this.isEdit = true;
    this.userId = item._id;
    this.AddEditForm.controls['name'].setValue(item.name);
    this.AddEditForm.controls['description'].setValue(item.description);
    this.AddEditForm.controls['email'].setValue(item.email);
    this.AddEditForm.controls['site_url'].setValue(item.site_url);
    this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
  }
  this.modalService.open(content).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    if (reason == 'Cross click' || reason == 0) {
      this.isEdit = false;
      this.AddEditForm.controls['name'].setValue('');
      this.AddEditForm.controls['description'].setValue('');
      this.AddEditForm.controls['email'].setValue('');
      this.AddEditForm.controls['site_url'].setValue('');
      this.AddEditForm.controls['phone_number'].setValue('');
    }
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}
//add-edit popup ends here

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
        this.alertService.success('Company is deleted!!', true);
        //setTimeout(()=>{ this.closePopup()},1000);
      },error => {
        this.alertService.error('Something went wrong, please try again!!', true);
        
      });
      },
      reject: () => {
    }
  });
}
// dlt pop up ends here

//alert-message 
alert(){
  this.subscription = this.alertService.getMessage().subscribe(message => { 
    this.message = message; 
});
}
// alert-message ends here

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
  this.subscription.unsubscribe();
}

closePopup() {
  var element = document.getElementById('closepopup');
  element.click();
}
onSubmit() {
  this.submitted = true;
  if (!this.AddEditForm.invalid) {
    let formData: FormData = new FormData();
    this.formData = this.AddEditForm.value;
    console.log('formadata==>',this.formData);
    if (this.isEdit) {
      this.formData.user_id = this.userId;
      console.log('userId', this.userId);
      this.service.put('admin/company/update', this.formData).subscribe(res => {
        this.render();
        this.closePopup();
        this.alertService.success('Company is edited!!', true);
      }, error => {
        this.alertService.error('Something went wrong, please try again!!', true)
        this.closePopup();
      })
    } else {
      this.service.post('admin/company/add', this.formData).subscribe(res => {
        this.render();
        this.closePopup();
        this.alertService.success('Company is added!!', true);
      }, error => {
        this.alertService.error('Something went wrong, please try again!!', true)
        this.closePopup();
      })
    }
    this.isEdit = false;
    this.submitted = false;
  }
}

ngOnInit() {
  this.UsersListData();
  this.alert();
}

}
