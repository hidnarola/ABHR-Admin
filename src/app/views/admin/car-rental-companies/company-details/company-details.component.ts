import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute  } from '@angular/router';
import { Router } from '@angular/router';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

//model
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

//popup-forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

//alert
import { AlertService } from '../../../../shared/services/alert.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

public index;
public viewData;
public userId;
public userDetails;
public carData;
public rentalData;

private subscription: Subscription;
message: any;
AddEditForm: FormGroup;
submitted = false;
public formData: any;
public isEdit;
closeResult: string;

@ViewChild(DataTableDirective)
dtElementcar: DataTableDirective;
dtElementrental: DataTableDirective;
dtOptions: DataTables.Settings = {};
//dtOptionsrental: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
//dtTriggerrental: Subject<any> = new Subject();
constructor(
  public renderer: Renderer,
  private dataShare: DataSharingService,
  private route: ActivatedRoute,
  private service: CrudService,
  private modalService: NgbModal,
  public router: Router,
  private fromBuilder: FormBuilder,
  private alertService : AlertService
) { 
  this.route.params.subscribe(params => { this.userId = params.id; });
  //addform validation
  const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');                                                                                                                                                                                                                                 
      this.AddEditForm = this.fromBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        site_url: ['',[Validators.required, Validators.pattern("^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$")]],
        phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
        email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
      })
      this.formData = {
        name: String,
        description: String,
        phone_number: Number,
        email: String,
        site_url: String
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
    //console.log('in valid', this.userId);
    this.formData = this.AddEditForm.value;
      this.formData.company_id = this.userId;
      //console.log(this.formData);
      this.service.put('admin/company/update', this.formData).subscribe(res => {
        //console.log('response after edit===>', res);
        //console.log('this.userDetails==>',this.userDetails);
        this.userDetails = this.formData;
        this.closePopup();
        this.alertService.success('Company is edited!!', true);
      }, error => {
        this.alertService.error('Something went wrong, please try again!!', true);
        this.closePopup();
      })
  }
}

UserDetails(){
  this.service.get('admin/company/details/'+this.userId).subscribe ( res =>{
    //console.log('userdetails RES==>',res['data']);
    this.userDetails = res['data'];
    //console.log('userDetails==>', this.userDetails);
  })
}

//model
open2(content, userDetails) { 
  //console.log('userDetails====>',userDetails);
  if( userDetails != 'undefined' && userDetails ){
    this.isEdit = true;
    this.AddEditForm.controls['name'].setValue(userDetails.name);
    this.AddEditForm.controls['description'].setValue(userDetails.description);
    this.AddEditForm.controls['email'].setValue(userDetails.email);
    this.AddEditForm.controls['site_url'].setValue(userDetails.site_url);
    this.AddEditForm.controls['phone_number'].setValue(userDetails.phone_number);
  };
  this.modalService.open(content).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}
//add-edit popup ends here

alert(){
  this.subscription = this.alertService.getMessage().subscribe(message => { 
    this.message = message; 
});
}

rendercar(): void {
  this.dtElementcar.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}

// renderrental(): void {
//   this.dtElementrental.dtInstance.then((dtInstance: DataTables.Api) => {
//     // Destroy the table first
//     dtInstance.destroy();
//     // Call the dtTrigger to rerender again
//     this.dtTriggerrental.next();
//   });
// }

ngOnDestroycar(): void {
  this.dtTrigger.unsubscribe();
  this.subscription.unsubscribe();
}

// ngOnDestroyrental(): void {
//   this.dtTriggerrental.unsubscribe();
//   this.subscription.unsubscribe();
// }

ngAfterViewInit(): void {
  this.dtTrigger.next();
  //this.dtTriggerrental.next();
}

CarData(){
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    serverSide: true,
    ordering: false,
    language: { "processing": "<i class='fa fa-refresh loader fa-spin'></i>" },
    ajax: (dataTablesParameters: any, callback) => {
      console.log('dataparametes car==>',dataTablesParameters);
      setTimeout(() => {
        console.log('dtaparametes car==>',dataTablesParameters);
        this.service.post('admin/company/car_list', dataTablesParameters).subscribe(res => {
          this.carData = res['result']['data'];
          console.log(this.carData);
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

RentalData(){
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    serverSide: true,
    ordering: false,
    language:{"processing": "<i class='fa fa-refresh loader fa-spin'></i>"},
    ajax: (dataTablesParameters: any, callback) => {
      console.log('dataparametes in rental==>', dataTablesParameters);
      setTimeout(() => {
      this.service.post('admin/agents/rental_list', dataTablesParameters).subscribe(res => {
        this.rentalData = res['result']['data'];
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
        name: 'i+1',
      },
      {
        data: 'Fisrt Name', 
        name:'first_name',
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
        data: 'Device Type',
        name: 'deviceType',
      },
      {
        data: 'Phone Number',
        name: 'phone_number',
      }
    ]
  };
}

ngOnInit() {
  this.CarData();
  this.UserDetails();
  this.RentalData();
  this.alert();
}

}
