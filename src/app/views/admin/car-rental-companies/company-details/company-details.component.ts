import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute  } from '@angular/router';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

//model
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

//popup-forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;

  constructor(
    public renderer: Renderer,
    private dataShare: DataSharingService,
    private route: ActivatedRoute,
    private service: CrudService,
    private modalService: NgbModal,
    private fromBuilder: FormBuilder
  ) {
    //addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');                                                                                                                                                                                                                                 
        this.AddEditForm = this.fromBuilder.group({
            username: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            phnumber: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
            email: ['', [Validators.required, Validators.email,Validators.pattern(pattern)]],
        })
   }
   //add-edit-popup form validation
   get f() { return this.AddEditForm.controls; }
   onSubmit(){
     this.submitted = true;

     if(this.AddEditForm.invalid){
         return;
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
 //public rentalData = data;
 
 public agents;

  ngOnInit() {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      ordering: false,
      language:{"processing": "<i class='fa fa-refresh loader fa-spin'></i>"},
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
        this.service.post('admin/agents/list', dataTablesParameters).subscribe(res => {
          this.agents = res['result']['data'];
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
          data: 'Name', 
          name: 'name',
        },
        {
          data: 'Gender', 
          name:'gender',
        },
        {
          data: 'Company',
          name: 'company',
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

//model
closeResult: string;
open2(content) { 
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

}
