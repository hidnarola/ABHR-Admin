import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute  } from '@angular/router';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

//model
import {NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

//popup-forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

//alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'


@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit {

public index;
public viewData;
public userId;
public agentDetails;

private subscription: Subscription;
message: any;

@ViewChild(DataTableDirective)
dtElement: DataTableDirective;
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();

AddEditForm: FormGroup;
submitted = false;
public formData: any;
public isEdit;
public rentalData;
closeResult: string;

constructor(
public renderer: Renderer,
private dataShare: DataSharingService,
private route: ActivatedRoute,
private service: CrudService,
private modalService: NgbModal,
public router: Router,
private fromBuilder: FormBuilder,
private messageService: MessageService,
private spinner: NgxSpinnerService
) {
this.route.params.subscribe(params => {
  this.userId = params.id;
});
//addform validation
const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');                                                                                                                                                                                                                                 
    this.AddEditForm = this.fromBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: ['',[ Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
        email: ['', [Validators.required, Validators.email,Validators.pattern(pattern)]],
        //deviceType: [''],
    })
    this.formData = {
      first_name: String,
      last_name: String,
      //deviceType: String,
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
    console.log('in valid', this.userId);
    this.formData = this.AddEditForm.value;
      this.formData.user_id = this.userId;
      console.log(this.formData);
      this.service.put('admin/agents/update', this.formData).subscribe(res => {
        console.log('response after edit===>', res);
        console.log('this.agentDetails==>',this.agentDetails);
        this.agentDetails = this.formData;
        this.closePopup();
        this.messageService.add({severity:'success', summary:'Success',  detail: res['message'] });
      },  err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message'] });
        this.closePopup();
      })
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

RentalData(){
  this.spinner.show();
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    serverSide: true,
    ordering: true,
    language:{"processing": "<i class='fa fa-refresh loader fa-spin'></i>"},
    ajax: (dataTablesParameters: any, callback) => {
      console.log('dataparametes==>', dataTablesParameters);
      setTimeout(() => {
      this.service.post('admin/agents/rental_list', dataTablesParameters).subscribe(res => {
        console.log('rentals res in agents', res)
        this.rentalData = res['result']['data'];
       // this.dataShare.changeLoading(false);
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
        data: 'Contract No.',
        name: 'car_id'
      },
      {
        data: 'Name',
        name: 'booking_number',
      },
      {
        data: 'Price',
        name: 'booking_rent',
      },
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

AgentDetails(){
   this.service.get('admin/agents/details/'+this.userId).subscribe ( res =>{
     console.log('userdetails==>',res);
     this.agentDetails = res['user'];
     console.log('agentdetails==>', this.agentDetails);
   })
}

ngAfterViewInit(): void {
  this.dtTrigger.next();
}

//model
open2(content, agentDetails) { 
  console.log('agentDetails====>',agentDetails);
  if( agentDetails != 'undefined' && agentDetails ){
    this.isEdit = true;
    this.AddEditForm.controls['first_name'].setValue(agentDetails.first_name);
    this.AddEditForm.controls['last_name'].setValue(agentDetails.last_name);
    this.AddEditForm.controls['email'].setValue(agentDetails.email);
    this.AddEditForm.controls['phone_number'].setValue(agentDetails.phone_number);
    //this.AddEditForm.controls['deviceType'].setValue(agentDetails.deviceType);
    console.log('firstname', agentDetails.first_name);
    console.log('lastname===>', agentDetails.last_name)
  };
  const options: NgbModalOptions = {
    keyboard: false,
    backdrop: 'static'
    };
  this.modalService.open(content, options).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, );
}

//add-edit popup ends here

ngOnInit() {
  this.RentalData();
  this.AgentDetails();
}

}
