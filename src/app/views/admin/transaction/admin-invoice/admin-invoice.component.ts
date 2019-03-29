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

    // const doc = new jspdf();
    // doc.addHTML(document.getElementById('Capture_invoice'), function () {
    //   doc.save('Tax-Invoice.pdf');
    // });



    const pdfdata = document.getElementById('Capture_invoice');
    // const pdf = new jspdf('p', 'pt', 'a4');
    // console.log('pdfdata => ', pdfdata);
    // // relevant function
    // const specialElementHandlers = {
    //   '#bypassme': function (element, renderer) {
    //     return true;
    //   }
    // };
    // const margin = {
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0
    // };
    let header = '<html lang=\"en\"><head><noscript><div><h1 style=\"text-align:center;';
    header += '\">Opps! Something went wrong.</h1><h4 style=\"color:#4c4949; text-align: center;';
    header += '\">Please Enable Javascript on your Browser</h4></div></noscript><base href=\"/';
    header += '\"><meta charset=\"utf-8\"><meta http-equiv=\"X-UA-Compatible\" ';
    header += 'content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width, ';
    header += 'initial-scale=1\"><meta name=\"description\" content=\"\"><meta name=\"author\" ';
    header += 'content=\"\"><title>ABHR- Admin</title><link rel=\"icon\" type=\"image/png\"';
    header += 'sizes=\"16x16\" href=\"assets/images/ABHRFav.png\" /></head> <body> ';

    const footer = '</body></html>';
    const newWindow = window.open('', '');
    newWindow.document.write(header + pdfdata.parentElement.innerHTML + footer);
    setTimeout(() => {
      newWindow.print();
      newWindow.close();
      this.isPDF = false;
    }, 1000);




    // pdf.fromHTML(pdfdata, 10, 10, {
    //   // 'width': 100, // max width of content on PDF
    //   'elementHandlers': specialElementHandlers
    // }, function (res) { pdf.output('datauri'); },
    //   margin);

    // pdf.output('datauri');
    // pdf.save('Tax-Invoice.pdf'); // Generated PDF

    // });
    // pdf.addHTML(pdfdata, { pagesplit: true }).then(() => {
    //   pdf.save('pdfTable.pdf');
    // });

    // html2canvas(pdfdata).then(canvas => {
    //   console.log('canvas => ', canvas);
    //   // Few necessary setting options
    //   var imgWidth = 208;
    //   var pageHeight = 500;
    //   // Before adding new content
    //   // var viewport = page.getViewport({ scale: scale, });
    //   // canvas.height = viewport.height;
    //   // canvas.width = viewport.width;
    //   console.log('canvas.height => ', canvas.height);
    //   console.log('imgWidth => ', imgWidth);
    //   console.log('canvas.width => ', canvas.width);
    //   // var imgHeight = canvas.height * imgWidth / canvas.width;
    //   // var heightLeft = imgHeight;
    //   var imgWidth = (canvas.width * 60) / 240;
    //   var imgHeight = (canvas.height * 46) / 240;
    //   const contentDataURL = canvas.toDataURL('image/png', 0.3);
    //   let pdf = new jspdf('p', 'pt', 'a4'); // A4 size page of PDF
    //   var position = 0;
    //   // let y = 500; // Height position of new content

    //   pdf.addImage(contentDataURL, 'PNG', 33, 0, imgWidth, imgHeight);
    //   // if (y >= pageHeight) {
    //   //   pdf.addPage();
    //   //   pdf.addImage(contentDataURL, 'PNG', 0, y, imgWidth, imgHeight);
    //   //   // y = 0; // Restart height position
    //   // }
    //   // pdf.fromHTML(canvas, { pagesplit: true });
    //   pdf.save('Tax-Invoice.pdf'); // Generated PDF
    //   this.isPDF = false;
    // });

  }

}
