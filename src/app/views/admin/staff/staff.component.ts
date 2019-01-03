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
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

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
  public title = "Add Company";

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
    private messageService: MessageService,
  ) {
    //addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.fromBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });

    this.formData = {
      first_name: String,
      last_name: String,
      // deviceType: String,
      phone_number: Number,
      email: String
    };
   }

//add-edit-popup form validation
get f() { return this.AddEditForm.controls; }

closePopup() {
  var element = document.getElementById('closepopup');
  element.click();
}
onSubmit() {
  this.submitted = true;
  if (!this.AddEditForm.invalid) {
    this.formData = this.AddEditForm.value;
    console.log('formadata==>',this.formData);
    if (this.isEdit) {
      this.formData.user_id = this.userId;
      this.title = "Edit Company";
      console.log('userId in staff', this.userId);
      this.service.put('admin/staff/update', this.formData).subscribe(res => {
        this.render();
        this.closePopup();
        this.messageService.add({severity:'success', summary:'Success',detail: res['message'] });
      }, err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message'] });
        this.closePopup();
      })
    } else {
      this.title = "Add Company";
      console.log('formdata in add==>',this.formData);
      this.service.post('admin/staff/add', this.formData).subscribe(res => {
        console.log('staff adddata==>',res)
        this.render();
        this.closePopup();
        this.messageService.add({severity:'success', summary:'Success', detail: res['message'] });
      }, err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message'] });
        this.closePopup();
      })
    }
    this.isEdit = false;
    this.submitted = false;
  }
}
//ends here

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
  //this.subscription.unsubscribe();
}


ngOnInit() {
  this.UsersListData();
}

UsersListData(){
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    serverSide: true,
    ordering: true,
    order: [[4, 'desc']],
    language: { "processing": "<i class='fa fa-refresh loader fa-spin'></i>" },
    ajax: (dataTablesParameters: any, callback) => {
      setTimeout(() => {
        console.log('dtaparametes==>',dataTablesParameters);
        this.service.post('admin/staff/list', dataTablesParameters).subscribe(res => {
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
        data: 'Phone Number',
        name: 'phone_number',
      },
      {
        data: 'Actions',
        name: 'createdAt',
        orderable: false
      }
    ]
  };
}


ngAfterViewInit(): void {
  this.dtTrigger.next();
}

//model
closeResult: string;
open2(content, item) {
  console.log('item==>', item);
  if (item != 'undefined' && item != '') {
    this.title = "Edit Company";
    this.isEdit = true;
    this.userId = item._id;
    this.AddEditForm.controls['first_name'].setValue(item.first_name);
    this.AddEditForm.controls['last_name'].setValue(item.last_name);
    this.AddEditForm.controls['email'].setValue(item.email);
    this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
  } else{
    this.title = "Add Company";
  }
  this.modalService.open(content).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    if (reason == 'Cross click' || reason == 0) {
      this.isEdit = false;
      this.AddEditForm.controls['first_name'].setValue('');
      this.AddEditForm.controls['last_name'].setValue('');
      this.AddEditForm.controls['email'].setValue('');
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
      this.service.put('admin/staff/delete', {user_id : userId}).subscribe(res => {
        this.render();
        this.messageService.add({severity:'success', summary:'Success', detail: res['message'] });
        //setTimeout(()=>{ this.closePopup()},1000);
      },err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message'] });          
      });
      },
      reject: () => {
    }
  });
}
// dlt pop up ends here

}
