import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from './../../../../../environments/environment';
import { CrudService } from '../../../../shared/services/crud.service';
import _ from 'lodash';
import { Constant } from '../../../../shared/constant/constant';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId: any;
  userData: any;
  public imageURL = environment.imgUrl + 'user/licence/';
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private service: CrudService,
    private CONST: Constant,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params.id;
      this.getUserDetail(params.id);
    });
  }

  getVerificationStatus(id) {
    try {
      return (_.find(this.CONST.VERIFICATION_STATUS, { 'key': id })).value;
    } catch (e) {
      return '';
    }
  }

  getUserDetail(id) {
    this.spinner.show();
    this.service.get('admin/user/details/' + id).subscribe(res => {
      this.userData = res['result'];
      this.userData.email_msg = this.getVerificationStatus(this.userData['email_verified']);
      this.userData.phone_msg = this.getVerificationStatus(this.userData['phone_number_verified']);
      this.userData.license_msg = this.getVerificationStatus(this.userData['driving_license_verification']);
      this.userData.id_msg = this.getVerificationStatus(this.userData['id_card_verification']);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  licenceVerification() {
    var obj = {
      'user_id': this.userId,
      'driving_license_verification': true
    };
    this.service.post('admin/user/verify', obj).subscribe(res => {
      if (res['status'] === 'success') {
        this.getUserDetail(this.userId);
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
    }, err => {
      err = err.error;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
  }

  idCardVerification() {
    var obj = {
      'user_id': this.userId,
      'id_card_verification': true
    };
    this.service.post('admin/user/verify', obj).subscribe(res => {
      if (res['status'] === 'success') {
        this.getUserDetail(this.userId);
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
    }, err => {
      err = err.error;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
  }

}
