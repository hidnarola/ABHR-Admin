import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { CrudService } from '../../../../shared/services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-invoice',
  templateUrl: './admin-invoice.component.html',
  styleUrls: ['./admin-invoice.component.css']
})
export class AdminInvoiceComponent implements OnInit {

  public imgUrl = environment.imgUrl;
  isPDF: boolean;
  public Id;
  public InvoiceData;
  public today;
  public isHidden: Boolean = false;

  constructor(
    public service: CrudService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.today = new Date();
    this.route.params.subscribe(params => {
      this.Id = params.id;
    });
    this.service.post('admin/transaction/invoice', { booking_id: this.Id }).subscribe(res => {
      console.log('res => ', res['data']);
      this.InvoiceData = res['data'];
      this.spinner.hide();
    });
  }

  ngOnInit() { }

  public captureScreen() {
    this.isPDF = true;
    var pdfdata = document.getElementById('Capture_invoice');
    html2canvas(pdfdata).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 500;
      // Before adding new content
      // var viewport = page.getViewport({ scale: scale, });
      // canvas.height = viewport.height;
      // canvas.width = viewport.width;
      console.log('canvas.height => ', canvas.height);
      console.log('imgWidth => ', imgWidth);
      console.log('canvas.width => ', canvas.width);
      // var imgHeight = canvas.height * imgWidth / canvas.width;
      // var heightLeft = imgHeight;
      var imgWidth = (canvas.width * 60) / 240;
      var imgHeight = (canvas.height * 46) / 240;
      const contentDataURL = canvas.toDataURL('image/png', 0.3);
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      // let y = 500; // Height position of new content

      pdf.addImage(contentDataURL, 'PNG', 33, 0, imgWidth, imgHeight);
      // if (y >= pageHeight) {
      //   pdf.addPage();
      //   pdf.addImage(contentDataURL, 'PNG', 0, y, imgWidth, imgHeight);
      //   // y = 0; // Restart height position
      // }

      pdf.save('Tax-Invoice.pdf'); // Generated PDF
      this.isPDF = false;
    });
  }

}
