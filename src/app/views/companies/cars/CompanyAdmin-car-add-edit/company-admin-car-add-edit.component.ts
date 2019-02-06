import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-company-admin-car-add-edit',
  templateUrl: './company-admin-car-add-edit.component.html',
  styleUrls: ['./company-admin-car-add-edit.component.css']
})
export class CarAddEditComponent implements OnInit {
  @ViewChild('availibility') datePicker;
  public licencePlateData: any;
  CarImage: any = [];
  CarOldImage: any = [];
  CarImageRAW: any = [];
  imgUrl = environment.imgUrl;
  AddEditCarForm: FormGroup;
  submitted = false;
  public formData: any;
  public isEdit: boolean;
  public carId;
  public carDetails;
  public detail;
  public companyId;
  public companyName;
  public users;
  public brandlist;
  public modelList;
  isLoading: boolean;
  public selectDate: Array<Date>;
  public finalDates: any = {};
  public availablityError: boolean = false;
  public selectedMonth;
  public selectedYear;
  public checked: Boolean = false;
  public availabilitySelectAllArr = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];
  yearRange = '2019:2020';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    this.companyName = company.name;

    this.route.params.subscribe(params => { this.carId = params.id; });
    console.log('carId==>', this.carId);

    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();

    if (this.carId !== undefined && this.carId !== '' && this.carId != null) {
      this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(resp => {
        this.carDetails = resp['data'].carDetail;
        if (this.carDetails.is_available !== undefined) {
          var DateArray = this.carDetails.is_available;
          const _selectDate = [];
          DateArray.forEach(element => {
            if (element.availability.length !== 0) {
              element.availability.forEach(ele => {
                let Dateobj = new Date(ele);
                _selectDate.push(Dateobj);
              });
            }
          });
          if (_selectDate && _selectDate.length > 0) {
            this.selectDate = _selectDate;
          }
        }
        this.isEdit = true;
        this.service.post('app/car/modelList', { brand_ids: [this.carDetails.car_brand_id] }).subscribe(res => {
          if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
            this.modelList = res['data'].model;
          } else {
            this.modelList = [{ _id: null, model_name: 'No models are available' }];
          }
        });
        this.AddEditCarForm.controls['car_brand_id'].setValue(this.carDetails.car_brand_id);
        this.AddEditCarForm.controls['car_model_id'].setValue(this.carDetails.car_model_id);
        this.AddEditCarForm.controls['rent_price'].setValue(this.carDetails.rent_price);
        this.AddEditCarForm.controls['deposit'].setValue(this.carDetails.deposit);
        this.AddEditCarForm.controls['no_of_person'].setValue(this.carDetails.no_of_person);
        this.AddEditCarForm.controls['resident_criteria'].setValue(this.carDetails.resident_criteria);
        this.AddEditCarForm.controls['transmission'].setValue(this.carDetails.transmission);
        this.AddEditCarForm.controls['milage'].setValue(this.carDetails.milage);
        this.AddEditCarForm.controls['car_class'].setValue(this.carDetails.car_class);
        this.carDetails.car_gallery.forEach(file => {
          this.CarOldImage.push(file);
        });
        console.log('this.carDetails.car_gallery => ', this.carDetails.car_gallery);
        console.log('this.CarOldImage => ', this.CarOldImage);
        this.AddEditCarForm.controls['driving_eligibility_criteria'].setValue(this.carDetails.driving_eligibility_criteria);
        this.AddEditCarForm.controls['is_navigation'].setValue(this.carDetails.is_navigation);
        this.AddEditCarForm.controls['is_AC'].setValue(this.carDetails.is_AC);
        this.AddEditCarForm.controls['is_luggage_carrier'].setValue(this.carDetails.is_luggage_carrier);
        this.AddEditCarForm.controls['licence_plate'].setValue(this.carDetails.licence_plate);
        this.AddEditCarForm.controls['car_color'].setValue(this.carDetails.car_color);
      });
    }
    this.service.get('app/car/brandlist').subscribe(res => {
      this.brandlist = res['data'].brand;
    });

    // addform validation
    this.AddEditCarForm = this.formBuilder.group({
      car_rental_company_id: this.companyId,
      car_id: this.carId,
      car_brand_id: ['', Validators.required],
      car_model_id: ['', Validators.required],
      rent_price: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      deposit: ['', Validators.pattern('[1-9][0-9]*')],
      no_of_person: ['', Validators.required],
      resident_criteria: ['', Validators.required],
      transmission: ['', Validators.required],
      milage: ['', Validators.required],
      car_class: ['', Validators.required],
      car_gallery: [''],
      new_images: [],
      old_images: [],
      is_change_photo: [false],
      driving_eligibility_criteria: ['', [Validators.required, Validators.min(18), Validators.max(120),
      Validators.pattern('[0-9]*')]],
      is_navigation: [false],
      is_AC: [false],
      is_luggage_carrier: [false],
      licence_plate: ['', Validators.compose([Validators.required, this.uniqueCarNumberValidator])],
      car_color: ['', Validators.required]
    });
    console.log('this.companyId => ', this.companyId);
    this.formData = {
      car_brand_id: String,
      car_model_id: String,
      rent_price: Number,
      no_of_person: Number,
      resident_criteria: Number,
      transmission: String,
      milage: String,
      car_class: String,
      car_gallery: String,
      is_navigation: Boolean,
      is_AC: Boolean,
      is_luggage_carrier: Boolean,
      driving_eligibility_criteria: Number,
      licence_plate: String,
      car_color: String,
      deposit: Number,
    };
  }
  getDaysInMonth(m, y) {
    var date = new Date(y, m, 1);
    const _selectDate = this.selectDate && this.selectDate.length ? this.selectDate : [];
    while (date.getMonth() === m) {
      _selectDate.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    this.selectDate = _selectDate;
  }
  public uniqueCarNumberValidator = (control: FormControl) => {
    let isWhitespace2;
    if ((isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      this.licencePlateData = { 'licence_plate': control.value };
      if (this.isEdit) {
        this.licencePlateData = { 'licence_plate': control.value, 'car_id': this.carId };
      }
      console.log('licencePlateData===>', this.licencePlateData);
      return this.service.post('checkcarNumber', this.licencePlateData).subscribe(res => {
        if (res['status'] === 'success') {
          this.f.licence_plate.setErrors({ 'uniqueName': true });
          return;
        } else {
          this.f.licence_plate.setErrors(null);
        }
      });
    }
  }

  modellist = (id) => {
    console.log(id);
  }
  get f() { return this.AddEditCarForm.controls; }

  model(id) {
    this.service.post('app/car/modelList', { brand_ids: [id] }).subscribe(res => {
      if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
        this.modelList = res['data'].model;
      } else {
        this.AddEditCarForm.controls['car_model_id'].setErrors({ 'isExist': true });
        this.modelList = [];
      }
    });
  }
  handleFileInput(event) {
    const files = event.target.files;
    console.log('files => ', files);
    if (files) {
      // this.CarImageRAW = files;
      for (const file of files) {
        this.CarImageRAW.push(file);
        // this.CarImageRAW = files;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.CarImage.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImage(index) {
    this.CarImage.splice(index, 1);
    this.CarImageRAW.splice(index, 1);
  }
  deleteOldImage(index) {
    this.CarOldImage.splice(index, 1);
  }
  handleCloseCalendar = () => {
    this.datePicker.overlayVisible = false;
  }
  handleClearCalendar = () => {

    this.selectDate = null;
    console.log('this.selectDate  => ', this.selectDate);
    this.datePicker.overlayVisible = false;
    this.availabilitySelectAllArr = [false, false, false, false, false, false, false, false, false, false, false, false];
  }
  onSubmit() {
    if (this.selectDate !== undefined && this.selectDate !== null) {
      this.availablityError = false;
      console.log(' 0 => ');
      this.selectDate.forEach(element => {
        console.log('here => ');
        var month = (moment(element).month() + 1);
        if (typeof this.finalDates[month] !== 'undefined') {
          const existArray = this.finalDates[month];
          existArray.push(moment(element));
          this.finalDates[month] = existArray;
        } else {
          this.finalDates[month] = [moment(element)];
        }
      });
    } else {
      this.availablityError = true;
    }
    this.submitted = true;
    console.log('this.CarImage.length => ', this.CarImage.length);
    if (this.CarImage.length > 2 || (Number(this.CarOldImage.length) + Number(this.CarImage.length)) > 2) {
      this.f.car_gallery.setErrors(null);
    } else {
      this.f.car_gallery.setErrors({ 'minImages': true });
      return;
    }
    const formData = new FormData();
    formData.append('car_rental_company_id', this.f.car_rental_company_id.value);
    formData.append('car_brand_id', this.f.car_brand_id.value);
    formData.append('car_model_id', this.f.car_model_id.value);
    formData.append('rent_price', this.f.rent_price.value);
    formData.append('deposit', this.f.deposit.value ? this.f.deposit.value : 0);
    formData.append('no_of_person', this.f.no_of_person.value);
    formData.append('resident_criteria', this.f.resident_criteria.value);
    formData.append('transmission', this.f.transmission.value);
    formData.append('milage', this.f.milage.value);
    formData.append('car_class', this.f.car_class.value);
    formData.append('driving_eligibility_criteria', this.f.driving_eligibility_criteria.value);
    formData.append('is_navigation', this.f.is_navigation.value);
    formData.append('is_AC', this.f.is_AC.value);
    formData.append('is_luggage_carrier', this.f.is_luggage_carrier.value);
    formData.append('licence_plate', this.f.licence_plate.value);
    formData.append('car_color', this.f.car_color.value);
    formData.append('is_available', JSON.stringify(this.finalDates));
    if (!this.AddEditCarForm.invalid && !this.availablityError) {
      console.log('this.AddEditCarForm.value => ', this.AddEditCarForm.value);
      console.log('this.CarImageRAW => ', this.CarImageRAW);
      const headers = new HttpHeaders();
      // this is the important step. You need to set content type as null
      headers.set('Content-Type', null);
      headers.set('Accept', 'multipart/form-data');
      if (this.isEdit) {
        formData.append('car_id', this.f.car_id.value);
        for (let i = 0; i < this.CarImageRAW.length; i++) {
          formData.append('new_images', this.CarImageRAW[i]);
        }
        if (this.CarImageRAW.length > 0) {
          formData.append('is_change_photo', 'true');
        } else {
          formData.append('is_change_photo', 'false');
        }
        formData.append('old_images', JSON.stringify(this.CarOldImage));
        console.log('this.CarOldImage => ', this.CarOldImage);
        console.log('this.CarImageNew => ', this.CarImageRAW);
        this.isLoading = true;
        console.log('AddEditCarForm.value => ', this.AddEditCarForm.value);
        this.service.post('admin/company/car/edit', formData, headers).subscribe(res => {
          console.log('res', res);
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      } else {
        for (let i = 0; i < this.CarImageRAW.length; i++) {
          formData.append('car_gallery', this.CarImageRAW[i]);
        }
        this.isLoading = true;
        console.log('formData => ', formData);
        this.service.post('admin/company/car/add', formData, headers).subscribe(res => {
          console.log('res', res);
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          err = err.error;
          this.isLoading = false;
          console.log('err => ', err);
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      }
    } else {
      return;
    }
  }
  checkSelect() {
    this.availablityError = false;
  }

  checkMonth(event) {
    this.selectedMonth = (event.month - 1);
    this.selectedYear = event.year;
  }

  selectAllDates() {
    if (this.availabilitySelectAllArr[this.selectedMonth] === true) {
      this.getDaysInMonth(this.selectedMonth, this.selectedYear);
    } else {
      this.unselectAllDates();
    }
  }

  unselectAllDates() {
    const remainingDates = [];
    this.selectDate.forEach((date) => {
      if (date.getMonth() !== this.selectedMonth) {
        remainingDates.push(new Date(date));
      }
    });
    setTimeout(() => {
      if (remainingDates.length > 0) {
        this.selectDate = remainingDates;
        this.selectedMonth = this.selectDate[0].getMonth();
        console.log('remaining dates month===>', remainingDates[0].getMonth());
        console.log('remaining dates chkbtn===>', this.availabilitySelectAllArr[this.selectedMonth[0].getMonth()]);
      } else {
        this.selectDate = null;
      }
    }, 0);
  }

  ngOnInit() { }

}
