import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../../shared/services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  public Id;
  public Detail;
  constructor(
    private route: ActivatedRoute,
    private service: CrudService,
    private spinner: NgxSpinnerService,
  ) {
    this.spinner.show();
    this.route.params.subscribe(params => { this.Id = params.id; });
  }

  ngOnInit() {
    this.service.post('admin/help/details/', { article_id: this.Id }).subscribe(res => {
      this.Detail = res['data'];
      this.spinner.hide();
    }, error => {
    });
  }

}
