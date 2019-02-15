import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.css']
})
export class AddEditCarComponent implements OnInit {
  @ViewChild('availibility') datePicker;

  public licencePlateData: any;
  CarImage: any = [];
  yearRange = '2019:2020';
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
  public cnt;
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

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
  ) {
    this.companyId = localStorage.getItem('companyId');
    this.route.params.subscribe(params => { this.carId = params.id; });
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();

    if (this.carId !== undefined && this.carId !== '' && this.carId != null) {
      this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(resp => {
        this.carDetails = resp['data'].carDetail;
        if (this.carDetails.is_available !== undefined) {
          var DateArray = this.carDetails.is_available;
          const _selectDate = [];
          DateArray.forEach(element => {
            console.log('element => ', element);
            console.log('element.month => ', element.month);
            if (element.month < 10) {
              var TotalDays = moment(this.selectedYear + '-' + '0' + element.month, 'YYYY-MM').daysInMonth();
            } else if (element.month > 10) {
              var TotalDays = moment(this.selectedYear + '-' + element.month, 'YYYY-MM').daysInMonth();
            }
            if (TotalDays === element.availability.length) {
              var selectedMonth = (element.month - 1);
              console.log('this.selectedMonth for checkbox=> ', selectedMonth);
              this.availabilitySelectAllArr[selectedMonth] = true;
            }
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
      deposit: ['', Validators.pattern('[0-9][0-9]*')],
      no_of_person: ['', Validators.required],
      resident_criteria: ['', Validators.required],
      transmission: ['', Validators.required],
      milage: ['', Validators.required],
      car_class: ['', Validators.required],
      car_gallery: [''],
      new_images: [],
      old_images: [],
      is_change_photo: [false],
      driving_eligibility_criteria: ['', Validators.required],
      is_navigation: [false],
      is_AC: [false],
      is_luggage_carrier: [false],
      licence_plate: ['', Validators.compose([Validators.required, this.uniqueCarNumberValidator])],
      car_color: ['', Validators.required],
    });
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
      driving_eligibility_criteria: String,
      licence_plate: String,
      car_color: String,
      deposit: Number
    };
  }

  getDaysInMonth(m, y) {
    const date = new Date(y, m, 1);
    const _selectDate = (this.selectDate && this.selectDate.length > 0) ? this.selectDate : [];
    while (date.getMonth() === m) {
      const _selectDateStr = [];
      const dateMom = moment(date).format('YYYY-MM-DD');
      _selectDate.map((dt) => {
        _selectDateStr.push(moment(dt).format('YYYY-MM-DD'));
      });
      if (_selectDateStr.indexOf(dateMom) < 0) {
        _selectDate.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    this.selectDate = _selectDate;
  }

  getDaysInSelectedMonth(selectedMonth, selectedYear) {
    const date = new Date(selectedYear, selectedMonth, 1);
    const _selectDate = (this.selectDate && this.selectDate.length > 0) ? this.selectDate : [];
    this.cnt = 1;
    var TotalDays;
    var month = selectedMonth + 1;
    if (month < 10) {
      TotalDays = moment(this.selectedYear + '-' + '0' + month, 'YYYY-MM').daysInMonth();
    } else if (month + 1 > 10) {
      TotalDays = moment(this.selectedYear + '-' + month, 'YYYY-MM').daysInMonth();
    }
    while (date.getMonth() === selectedMonth) {
      const _selectDateStr = [];
      const dateMom = moment(date).format('YYYY-MM-DD');
      _selectDate.map((dt) => {
        _selectDateStr.push(moment(dt).format('YYYY-MM-DD'));
      });
      if (_selectDateStr.indexOf(dateMom) > 0) {
        this.cnt++;
        console.log('this.cnt(if) => ', this.cnt);
      }
      date.setDate(date.getDate() + 1);
    }
    console.log('cnt====>', this.cnt);
    console.log('totaldays====>', TotalDays);
    if (this.cnt === TotalDays) {
      this.availabilitySelectAllArr[selectedMonth] = true;
    } else {
      this.availabilitySelectAllArr[selectedMonth] = false;
    }
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

  modellist = (id) => { }
  get f() { return this.AddEditCarForm.controls; }

  model(id) {
    // let formdata = [e.brand_ids];
    this.service.post('app/car/modelList', { brand_ids: [id] }).subscribe(res => {
      if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
        this.modelList = res['data'].model;
        this.AddEditCarForm.controls['car_model_id'].setValue(this.modelList[0]._id);
        this.AddEditCarForm.controls['car_model_id'].setErrors(null);
      } else {
        this.AddEditCarForm.controls['car_model_id'].setErrors({ 'isExist': true });
        this.modelList = [];
      }
    }, error => {
      this.modelList = [];
      this.AddEditCarForm.controls['car_model_id'].setErrors({ 'isExist': true });
    });
  }

  handleFileInput(event) {
    let isValid = false;
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          isValid = true;
        } else {
          isValid = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Image Format' });
          return 0;
        }
      }
    }
    if (isValid) {
      for (const file of files) {
        this.CarImageRAW.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.CarImage.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {

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
    this.datePicker.overlayVisible = false;
    this.availabilitySelectAllArr = [false, false, false, false, false, false, false, false, false, false, false, false];
  }

  onSubmit() {
    if (this.selectDate !== undefined && this.selectDate !== null) {
      this.availablityError = false;
      this.selectDate.forEach(element => {
        var month = (moment(element).month() + 1);
        const strElement = moment(element).format('YYYY-MM-DD');
        if (typeof this.finalDates[month] !== 'undefined') {
          const existArray = this.finalDates[month];
          existArray.push(moment.utc(strElement));
          this.finalDates[month] = existArray;
        } else {
          this.finalDates[month] = [moment.utc(strElement)];
        }
      });
    } else {
      this.availablityError = true;
    }

    this.submitted = true;
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
        this.isLoading = true;
        this.service.post('admin/company/car/edit', formData, headers).subscribe(res => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/admin/car-rental-companies/view/' + localStorage.getItem('companyId')]);
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
        this.service.post('admin/company/car/add', formData, headers).subscribe(res => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/admin/car-rental-companies/view/' + localStorage.getItem('companyId')]);
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      }
    } else {
      return;
    }
  }

  onChange(event) {
    this.getDaysInSelectedMonth(this.selectedMonth, this.selectedYear);
  }

  checkSelect(event) {
    this.availablityError = false;
  }

  checkMonth(event) {
    this.selectedMonth = (event.month - 1);
    console.log('this.cnt in check month => ', this.cnt);
    console.log('this.selectedMonth => ', this.selectedMonth);
    this.selectedYear = event.year;
  }

  selectAllDates(event) {
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
      } else {
        this.selectDate = null;
      }
    }, 0);
  }

  ngOnInit() { }

}
