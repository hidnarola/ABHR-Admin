import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// services
import { CrudService } from '../../../../shared/services/crud.service';
import { DataSharingService } from '../../../../shared/services/data-sharing.service';

// model
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

// popup-forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

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
  closeResult: string;
  isLoading: Boolean;


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
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => {
      this.userId = params.id;
    });
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
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
    if (element !== null) {
      element.click();
    }
  }
  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.AddEditForm.invalid) {
      this.formData = this.AddEditForm.value;
      this.formData.user_id = this.userId;
      this.service.put('admin/staff/update', this.formData).subscribe(res => {
        this.userDetails = this.formData;
        // this.closePopup();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        // this.closePopup();
      });
      this.closePopup();
    }
  }

  UserDetails() {
    this.spinner.show();
    this.service.get('admin/staff/details/' + this.userId).subscribe(res => {
      this.userDetails = res['user'];
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  // model
  open2(content, userDetails) {
    if (userDetails !== 'undefined' && userDetails) {
      this.isEdit = true;
      this.AddEditForm.controls['first_name'].setValue(userDetails.first_name);
      this.AddEditForm.controls['last_name'].setValue(userDetails.last_name);
      this.AddEditForm.controls['email'].setValue(userDetails.email);
      this.AddEditForm.controls['phone_number'].setValue(userDetails.phone_number);
      // this.AddEditForm.controls['deviceType'].setValue(userDetails.deviceType);
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
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
  // add-edit popup ends here

  ngOnInit() {
    this.UserDetails();
  }

}
