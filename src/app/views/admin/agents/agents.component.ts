import { Component, OnInit, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AgentAddEditComponent } from "./../../../shared/model-popup/agent-add-edit/agent-add-edit.component";

//routing
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//model
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//service
import { DataSharingService } from '../../../shared/services/data-sharing.service'
import { CrudService } from '../../../shared/services/crud.service';

//popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


const AgentRoutes: Routes = []

declare var require: any;

//const data: any = require('../../../table/data-table/company.json');
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})

@NgModule({
  imports: [RouterModule.forChild(AgentRoutes)],
  exports: [RouterModule]
})

export class AgentsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public userId;
  public isEdit: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public dialog: MatDialog,
    public router: Router,
    // private datePipe: DatePipe,
    //model
    private modalService: NgbModal,
    private fromBuilder: FormBuilder
  ) {
    //addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.fromBuilder.group({
      // username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      deviceType: [''],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{10}")]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]]
    });

    this.formData = {
      first_name: String,
      last_name: String,
      deviceType: String,
      phone_number: Number,
      email: String
    };
  }
  //add-edit-popup form validation
  get f() { return this.AddEditForm.controls; }

  closePopup() {
    var element = document.getElementById('closepopup');
    element.click();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      console.log('in valid');
      this.formData = this.AddEditForm.value;
      if (this.isEdit) {
        this.formData.user_id = this.userId;
        console.log(this.formData);
        this.service.put('admin/agents/update', this.formData).subscribe(res => {
          console.log('response after edit===>', res);
          this.closePopup();
        }, err => {
          this.closePopup();
          var err_message = err.error.message;
        })
      } else {
        this.service.post('admin/agents/add', this.formData).subscribe(res => {
          console.log('response after add===>', res);
          this.closePopup();
        }, err => {
          var err_message = err.error.message;
          this.closePopup();
        })
      }
      this.isEdit = false;
    }
  }

  //ends here

  render(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  //public agentData = data;
  public agents;

  title = 'angulardatatables';
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      language: { "processing": "<i class='fa fa-refresh loader fa-spin'></i>" },
      // ajax: (dataTablesParameters: any, callback) => {
      //     callback({
      //       recordsTotal: 5,
      //       recordsFiltered: 5,
      //       data: data
      //     });
      // },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          this.service.post('admin/agents/list', dataTablesParameters).subscribe(res => {
            this.agents = res['result']['data'];
            console.log(this.agents);
            this.dataShare.changeLoading(false);
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
          })
        }, 1000)
      },
      columns: [
        {
          data: 'Id',
          name: 'i+1',
        },
        {
          data: 'Fisrt Name',
          name: 'first_name',
        },
        {
          data: 'Last Name',
          name: 'last_name',
        },
        {
          data: 'Email',
          name: 'email',
        },
        {
          data: 'Device Type',
          name: 'deviceType',
        },
        {
          data: 'Phone Number',
          name: 'phone_number',
        },
        {
          data: 'Actions',
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  AddModel() {
    // const dialogRef = this.dialog.open(AgentAddEditComponent, {
    //   height: '600px',
    //   width: '600px',
    //   data: {}
    // });
  }

  //model
  closeResult: string;
  open2(content, item) {
    console.log('item==>', item);
    if (item != 'undefined' && item != '') {
      this.isEdit = true;
      this.userId = item._id;
      this.AddEditForm.controls['first_name'].setValue(item.first_name);
      this.AddEditForm.controls['last_name'].setValue(item.last_name);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
      this.AddEditForm.controls['deviceType'].setValue(item.deviceType);
    }
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason == 'Cross click' || reason == 0) {
        this.isEdit = false;
        this.AddEditForm.controls['first_name'].setValue('');
        this.AddEditForm.controls['last_name'].setValue('');
        this.AddEditForm.controls['email'].setValue('');
        this.AddEditForm.controls['phone_number'].setValue('');
        this.AddEditForm.controls['deviceType'].setValue('');
      }
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

  //delete popup model
  delete(content2) {
    this.modalService.open(content2).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //ends here

}