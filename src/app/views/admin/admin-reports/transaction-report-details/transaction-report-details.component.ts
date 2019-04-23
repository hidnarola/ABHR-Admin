import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from './../../../../../environments/environment';
import { CrudService } from '../../../../shared/services/crud.service';
import _ from 'lodash';
import { Constant } from '../../../../shared/constant/constant';
import { MessageService } from 'primeng/api';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-transaction-report-details',
  templateUrl: './transaction-report-details.component.html',
  styleUrls: ['./transaction-report-details.component.css']
})
export class TransactionReportDetailsComponent implements OnInit {

  transactionReportId: any;
  transactionReportData: any;
  transactionReportUserToAgentData: any;
  transactionReportAgenttocompanyData : any;
  transactionReportAgenttouserData : any;

  usertocompanydefecteditem1: any;
  usertocompanydefecteditem2: any;
  usertocompanydefecteditem3: any;

  usertoagentdefecteditem1: any;
  usertoagentdefecteditem2: any;
  usertoagentdefecteditem3: any;

  agenttouserdefecteditem1: any;
  agenttouserdefecteditem2: any;
  agenttouserdefecteditem3: any;

  public ExcelArray = [];
  isExcel: boolean;
  isPDF: boolean;
  public exportData: any;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private service: CrudService,
    private CONST: Constant,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.transactionReportId = params.id;
      this.gettransactionReportDetail(params.id);
    });
    
  }


 

  public captureScreen() {
    this.isPDF = true;
   
    var pdfdata = document.getElementById('contentToConvert');
 // var pdfdata = $('#contentToConvert_wrapper').children(".dataTables_scroll")[0];
    html2canvas(pdfdata).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 170;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Transaction-Report.pdf'); // Generated PDF   
    });
    this.isPDF = false;
  }
 

  getVerificationStatus(id) {
    try {
      return (_.find(this.CONST.VERIFICATION_STATUS, { 'key': id })).value;
    } catch (e) {
      return '';
    }
  }

  gettransactionReportDetail(id) {
    // this.spinner.show();

    // console.log(id)
    
    this.service.get('admin/user/user_detail/' + id).subscribe(res => {
       console.log(id);
        this.transactionReportData = res['result'];
      //  console.log('transactionReportDetail => ', this.transactionReportData.data[0]);
        console.log('transactionReportDetail => ', this.transactionReportData.data[0].car_details._id);
    //  console.log('transactionReportDetail => ', this.transactionReportData.data[0].status);


    this.service.get('admin/user/agent_to_company/' +this.transactionReportData.data[0].carId+'/'+this.transactionReportData.data[0].car_handover_by_agent_id).subscribe(res => {
      //  this.service.get('admin/user/agent_to_company/5c62a28432e215078e1b0a6f/5c766a7a25e1ba7200ef7c65').subscribe(res => {
          this.transactionReportAgenttocompanyData = res;
           console.log('Agenttocompany', this.transactionReportAgenttocompanyData['handoverData']);
           if(this.transactionReportAgenttocompanyData['handoverData'].defected_points[0]){

            this.usertocompanydefecteditem1 = this.transactionReportAgenttocompanyData['handoverData'].defected_points[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
           }
           if(this.transactionReportAgenttocompanyData['handoverData'].defected_points[1]){

            this.usertocompanydefecteditem2 = this.transactionReportAgenttocompanyData['handoverData'].defected_points[1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
           }
           if(this.transactionReportAgenttocompanyData['handoverData'].defected_points[2]){

            this.usertocompanydefecteditem3 = this.transactionReportAgenttocompanyData['handoverData'].defected_points[2].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
           }
       
          this.spinner.hide();
       }, error => {
         this.spinner.hide();
       });

    this.service.get('admin/user/agent_to_user/' +this.transactionReportData.data[0].carId+'/'+this.transactionReportData.data[0].user_details._id+'/'+this.transactionReportData.data[0].car_handover_by_agent_id).subscribe(res => {
     // this.service.get('admin/user/agent_to_user/5c766d9f25e1ba7200ef7c6a/5c766e2f25e1ba7200ef7c6f/5c766a7a25e1ba7200ef7c65').subscribe(res => {
        this.transactionReportAgenttouserData = res;
         console.log('Agenttouser', this.transactionReportAgenttouserData['handoverData']);
         if(this.transactionReportAgenttouserData['handoverData'].defected_points[0]){
          this.agenttouserdefecteditem1 = this.transactionReportAgenttouserData['handoverData'].defected_points[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
        
         }
         if(this.transactionReportAgenttouserData['handoverData'].defected_points[1]){
          this.agenttouserdefecteditem2 = this.transactionReportAgenttouserData['handoverData'].defected_points[1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
         
         }
         if(this.transactionReportAgenttouserData['handoverData'].defected_points[2]){
          this.agenttouserdefecteditem3 = this.transactionReportAgenttouserData['handoverData'].defected_points[2].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
        
         }
        
        this.spinner.hide();
     }, error => {
       this.spinner.hide();
     });

     
       
     //  this.service.get('admin/user/handover_detail/5c766d9f25e1ba7200ef7c6a/5c766e2f25e1ba7200ef7c6f').subscribe(res => {
      this.service.get('admin/user/handover_detail/'+this.transactionReportData.data[0].carId+'/'+this.transactionReportData.data[0].user_details._id).subscribe(res => {   
        this.transactionReportUserToAgentData = res;
              console.log('usertoagent', this.transactionReportUserToAgentData['handoverData']);
              if(this.transactionReportUserToAgentData['handoverData'].defected_points[0]){
                this.usertoagentdefecteditem1 = this.transactionReportUserToAgentData['handoverData'].defected_points[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
              }
              if(this.transactionReportUserToAgentData['handoverData'].defected_points[1]){
                this.usertoagentdefecteditem2 = this.transactionReportUserToAgentData['handoverData'].defected_points[1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
              }
              if(this.transactionReportUserToAgentData['handoverData'].defected_points[2]){
                this.usertoagentdefecteditem3 = this.transactionReportUserToAgentData['handoverData'].defected_points[2].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');  
              }
             this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });


       this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });

   
  }

}
