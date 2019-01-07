import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../../../../shared/services/crud.service';
import _ from 'lodash';
import { Constant } from '../../../../shared/constant/constant';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId: any;
  userData: any;
  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService,
    private service: CrudService, private CONST: Constant) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params.id;
      this.getUserDetail(params.id);
    });
  }

  getVerificationStatus(id) {
    if (id) {
      return (_.find(this.CONST.VERIFICATION_STATUS, { 'key': id })).value;
    }
    return '';
  }

  getUserDetail(id) {
    this.spinner.show();
    this.service.get('admin/user/details/' + id).subscribe(res => {
      console.log('res => ', res);
      this.userData = res['result'];
      console.log('carDetails ==>', this.userData);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
}
