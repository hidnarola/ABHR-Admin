import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

//model
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//popup-forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})
export class StaffDetailComponent implements OnInit {

  public index;
  public viewData;
  public userId;
  public userDetails;

  private subscription: Subscription;
  message: any;
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public isEdit;

  constructor(
    public renderer: Renderer,
    private dataShare: DataSharingService,
    private route: ActivatedRoute,
    private service: CrudService,
    private modalService: NgbModal,
    public router: Router,
    private fromBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.route.params.subscribe(params => {
      this.userId = params.id;
    });
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.fromBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]],
      // deviceType: [''],
    });
    this.formData = {
      first_name: String,
      last_name: String,
      phone_number: Number,
      email: String
    };
  }

  // add-edit-popup form validation
  get f() { return this.AddEditForm.controls; }
  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      console.log('in valid', this.userId);
      this.formData = this.AddEditForm.value;
      this.formData.user_id = this.userId;
      console.log(this.formData);
      this.service.put('admin/staff/update', this.formData).subscribe(res => {
        console.log('response after edit===>', res);
        this.userDetails = this.formData;
        console.log('this.userDetails==>', this.userDetails);
        // this.closePopup();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        // this.closePopup();
      });
      this.closePopup();
    }
  }

  UserDetails() {
    this.service.get('admin/staff/details/' + this.userId).subscribe(res => {
      console.log('userdetails==>', res);
      this.userDetails = res['user'];
      console.log('userDetails==>', this.userDetails);
    })
  }

  // model
  closeResult: string;
  open2(content, userDetails) {
    console.log('userDetails====>', userDetails);
    if (userDetails != 'undefined' && userDetails) {
      this.isEdit = true;
      this.AddEditForm.controls['first_name'].setValue(userDetails.first_name);
      this.AddEditForm.controls['last_name'].setValue(userDetails.last_name);
      this.AddEditForm.controls['email'].setValue(userDetails.email);
      this.AddEditForm.controls['phone_number'].setValue(userDetails.phone_number);
      // this.AddEditForm.controls['deviceType'].setValue(userDetails.deviceType);
      console.log('firstname', userDetails.first_name);
      console.log('lastname===>', userDetails.last_name)
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
      return `with: ${reason}`;
    }
  }
  //add-edit popup ends here

  ngOnInit() {
    this.UserDetails();
  }

}
