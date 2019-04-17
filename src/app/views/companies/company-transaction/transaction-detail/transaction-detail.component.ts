import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

  public transactionDetails;
  public transactionId;
  public todate;
  public date;

  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService,
  ) {
    this.route.params.subscribe(params => { this.transactionId = params.id; });
  }

  TransactionDetails() {
    this.spinner.show();
    this.service.post('company/transaction/details/', { booking_id: this.transactionId }).subscribe(res => {
      this.transactionDetails = res['result']['data'];
      if (this.transactionDetails.extended_days !== null) {
        this.date = moment(this.transactionDetails.to_time).subtract(this.transactionDetails.extended_days, 'days');
        this.todate = this.date._d;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  ngOnInit() {
    this.TransactionDetails();
  }

}
