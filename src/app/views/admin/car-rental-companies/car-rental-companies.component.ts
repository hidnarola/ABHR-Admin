// <reference types="@types/googlemaps" />
import { Component, OnInit, Renderer, ViewChild, OnDestroy, AfterViewInit, ElementRef, 
  NgZone, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// routing
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
// service
import { DataSharingService } from '../../../shared/services/data-sharing.service';
import { CrudService } from '../../../shared/services/crud.service';

// popup-forms
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// model
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// primng
import { ConfirmationService, Message } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

// alert
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

// AGM
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { google } from '@agm/core/services/google-maps-types';
// import { } from 'googlemaps';
// declare var self: any;
@Component({
  selector: 'app-car-rental-companies',
  templateUrl: './car-rental-companies.component.html',
  styleUrls: ['./car-rental-companies.component.css']
})
export class CarRentalCompaniesComponent implements OnInit, OnDestroy, AfterViewInit {

  // @Input() adressType: String;
  // @Output() setAddress: EventEmitter<any> = new EventEmitter();
  // @ViewChild('addresstext') addresstext: any;
  @ViewChild(DataTableDirective)
  // @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('search')
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public searchElementRef: ElementRef;
  public header;
  AddEditForm: FormGroup;
  submitted = false;
  public formData: any;
  public emailData: any;
  public nameData: any;
  public title = 'Add Company';
  public userId;
  public isEdit: boolean;
  public isDelete: boolean;
  users: any;
  private subscription: Subscription;
  checked: boolean;
  message: any;
  msgs: Message[] = [];
  closeResult: string;
  isLoading: boolean;

  // autocompleteInput: string;
  // queryWait: boolean;

  constructor(
    public renderer: Renderer,
    public service: CrudService,
    private dataShare: DataSharingService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    // public mapsAPILoader: MapsAPILoader,
    // private ngZone: NgZone,
    // googleMapsAPIWrapper: GoogleMapsAPIWrapper,
  ) {
    // if (this.users.hasOwnProperty('location')) {
    // } else {
    //   this.users['location'] = { type: 'Point', coordinates: [] }
    // }
    // addform validation
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.AddEditForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.uniqueNameValidator])],
      description: ['', Validators.required],
      site_url: ['', Validators.compose([Validators.required,
        Validators.pattern('^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$')])],
      phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(pattern), this.uniqueEmailValidator])],
      // address: [''],
      // latitude: ['']
    });

    this.formData = {
      name: String,
      description: String,
      phone_number: Number,
      email: String,
      site_url: String,
      // address: String,
    };
  }

  public uniqueEmailValidator = (control: FormControl) => {
    let isWhitespace1;
    if ( isWhitespace1 = (control.value || '').trim().length === 0) {
      return { 'required': true };
    } else {
      const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
      var result = pattern.test(control.value);
      if (!result) {
        return { 'pattern': true };
      } else {
        this.emailData = {'email' : control.value};
        if (this.isEdit) {
          this.emailData = { 'email' : control.value, 'company_id': this.userId};
          console.log('company id', this.userId);
        }
        console.log('emailData===>', this.emailData);
        return this.service.post('admin/company/checkemail', this.emailData).subscribe(res => {
          // return (res['status'] === 'success') ? {'unique': true} : null;
          // console.log('response of validation APi', res['status']);
          // if (res['status'] === 'success') {
          //   console.log('if==>');
          // } else {
          //   console.log('else==>');
          // }
          if (res['status'] === 'success') {
            this.f.email.setErrors({'unique': true});
            return;
          } else {
            this.f.email.setErrors(null);
          }
        });
      }
    }
  }

  public uniqueNameValidator = (control: FormControl) => {
    let isWhitespace2;
    if ( (isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      // const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
      // var result = pattern.test(control.value);
      // if (!result) {
      //   return { 'pattern': true };
      // } else {
        this.nameData = {'name' : control.value};
        if (this.isEdit) {
          this.nameData = { 'name' : control.value, 'company_id': this.userId};
          console.log('company id', this.userId);
        }
        console.log('nameData===>', this.nameData);
        return this.service.post('admin/company/checkname', this.nameData).subscribe(res => {
          // return (res['status'] === 'success') ? {'unique': true} : null;
          // console.log('response of validation APi', res['status']);
          // if (res['status'] === 'success') {
          //   console.log('if==>');
          // } else {
          //   console.log('else==>');
          // }
          if (res['status'] === 'success') {
            this.f.name.setErrors({'uniqueName': true});
            return;
          } else {
            this.f.name.setErrors(null);
          }
        });
      // }
    }
  }

  get f() { return this.AddEditForm.controls; }
  UsersListData() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ordering: true,
      order: [[5, 'desc']],
      language: { 'processing': '<i class="fa fa-refresh loader fa-spin"></i>' },
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          dataTablesParameters['columns'][5]['isBoolean'] = true;
          console.log('dtaparametes car rental company==>', dataTablesParameters);
          this.service.post('admin/company/list', dataTablesParameters).subscribe(res => {
            this.users = res['result']['data'];
            console.log(this.users);
            this.spinner.hide();
            callback({
              recordsTotal: res['result']['recordsTotal'],
              recordsFiltered: res['result']['recordsTotal'],
              data: []
            });
          });
        }, 1000);
      },
      columns: [
        {
          data: 'Company Name',
          name: 'name',
        },
        {
          data: 'Description',
          name: 'description',
        },
        {
          data: 'Email',
          name: 'email',
        },
        {
          data: 'Site URl',
          name: 'site_url',
        },
        {
          data: 'Phone Number',
          name: 'phone_number',
        }, {
          data: 'Status',
          name: 'is_Active',
          searchable: false
        },
        {
          data: 'Actions',
          name: 'createdAt',
          orderable: false
        }
      ]
    };
  }

  //   public handleAddressChange(address: Address) {
  //   // Do some stuff
  // }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // this.getPlaceAutocomplete();
  }

  // Add-Edit pop up
  open2(content, item) {
    console.log('item==>', item);
    if (item !== 'undefined' && item !== '') {
      this.title = 'Edit Company';
      this.isEdit = true;
      console.log('title', this.title);
      this.userId = item._id;
      this.AddEditForm.controls['name'].setValue(item.name);
      this.AddEditForm.controls['description'].setValue(item.description);
      this.AddEditForm.controls['email'].setValue(item.email);
      this.AddEditForm.controls['site_url'].setValue(item.site_url);
      this.AddEditForm.controls['phone_number'].setValue(item.phone_number);
    } else {
      this.title = 'Add Company';
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if (reason === 'Cross click' || reason === 0) {
        this.isEdit = false;
        this.AddEditForm.controls['name'].setValue('');
        this.AddEditForm.controls['description'].setValue('');
        this.AddEditForm.controls['email'].setValue('');
        this.AddEditForm.controls['site_url'].setValue('');
        this.AddEditForm.controls['phone_number'].setValue('');
      }
    });
    this.submitted = false;
  }
  // add-edit popup ends here

  // dlt popup
  delete(userId) {
    console.log('userId==>', userId);
    this.confirmationService.confirm({
      message: 'Are you sure want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.put('admin/company/delete', { company_id: userId }).subscribe(res => {
          this.render();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      },
      reject: () => {
      }
    });
  }
  // dlt pop up ends here

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

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
    this.isLoading = false;
  }

  handleChange(e, id) {
    console.log(e);
    console.log('comp id => ', id);
    const params = {
      company_id: id,
      status: e.checked
    };
    this.service.post('admin/company/change_status', params)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status change succesfully' });
      }, error => {
        console.log(error);
        e.checked = !e.checked;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.AddEditForm.invalid) {
      this.isLoading = true;
      this.formData = this.AddEditForm.value;
      console.log('formadata==>', this.formData);
      if (this.isEdit) {
        this.formData.company_id = this.userId;
        this.title = 'Edit Company';
        console.log('userId', this.userId);
        this.service.put('admin/company/update', this.formData).subscribe(res => {
          console.log('after update==>', res);
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      } else {
        this.title = 'Add Company';
        this.service.post('admin/company/add', this.formData).subscribe(res => {
          this.render();
          this.closePopup();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.closePopup();
        });
      }
      this.isEdit = false;
      this.submitted = false;
    } else {
      return;
    }
  }

  getCity(addressArray) {
    const city = addressArray.find((obj) => {
      if (obj['types'].indexOf('locality') !== -1) {
        return true;
      }
    })
    return city['long_name'];
  }

  // Address() {
  //   this.mapsAPILoader.load().then(() => {
  //     const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
  //       types: ['(cities)']
  //     });
  //     console.log('here==>', autocomplete);
  //     autocomplete.addListener('place_changed', () => {
  //       this.ngZone.run(() => {
  //         const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  //         // verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }
  //         const lng = place.geometry.location.lng();
  //         const lat = place.geometry.location.lat();
  //         this.users.location = { type: 'Point', coordinates: [lng, lat] }
  //         this.users.city = this.getCity(place['address_components']);
  //         this.users.formatted_address = this.searchElementRef.nativeElement.value;
  //       });
  //     });
  //   });
  // }

  // private getPlaceAutocomplete() {
  //   // const autocomplete = new google.maps.places.Autocomplete( this.addresstext.nativeElement,
  //   //     {
  //   //         componentRestrictions: { country: 'US' },
  //   //         types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
  //   //     });
  //   const autocomplete1 = new google.maps.places.Autocomplete( this.addresstext.nativeElement,
  //     {
  //         componentRestrictions: { country: 'US' },
  //         types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
  //     });
  //   // google.maps.event.addListener(autocomplete, 'place_changed', () => {
  //   //     const place = autocomplete.getPlace();
  //   //     this.invokeEvent(place);
  //   // });
  // }
  //   invokeEvent(place: Object) {
  //           this.setAddress.emit(place);
  // }

  ngOnInit() {
    // this.mapsAPILoader.load().then(() => {
    //   const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ['(cities)']
    //   });
    //   console.log('here==>', autocomplete);
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       // verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       const lng = place.geometry.location.lng();
    //       const lat = place.geometry.location.lat();
    //       this.users.location = { type: 'Point', coordinates: [lng, lat] }
    //       this.users.city = this.getCity(place['address_components']);
    //       this.users.formatted_address = this.searchElementRef.nativeElement.value;
    //     });
    //   });
    // });
    this.UsersListData();
  }

}
