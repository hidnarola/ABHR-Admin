import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../../../shared/services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reported-car-detail',
  templateUrl: './reported-car-detail.component.html',
  styleUrls: ['./reported-car-detail.component.css']
})
export class ReportedCarDetailComponent implements OnInit {

  public Id;
  public reportedCar;

  constructor(
    public service: CrudService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.Id = params.id;
    });
    this.service.post('admin/reports/details', { report_id: this.Id }).subscribe(res => {
      this.reportedCar = res['data'];
      this.spinner.hide();
    });
  }

  ngOnInit() {
  }

}
