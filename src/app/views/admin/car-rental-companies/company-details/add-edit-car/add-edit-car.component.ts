import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.css']
})
export class AddEditCarComponent implements OnInit {

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
  public today;
  public checked: Boolean = false;
  public cnt;
  public carAvailableDates;
  public carBookedDates;
  public availabilitySelectAllArr: any = [{ value: false }, { value: false }, { value: false }, { value: false },
  { value: false }, { value: false }, { value: false }, { value: false }, { value: false }, { value: false },
  { value: false }, { value: false }];
  public numberErr: boolean = false;
  public numberErr2: boolean = false;
  public numberErr3: boolean = false;
  bookedDates: Array<Date> = [];
  currentMonthBookedDates: Array<any> = [];
  public bookedDateObj;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
    public spinner: NgxSpinnerService
  ) {
    this.companyId = localStorage.getItem('companyId');
    this.route.params.subscribe(params => { this.carId = params.id; });
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
    this.today = new Date();

    if (this.carId !== undefined && this.carId !== '' && this.carId != null) {
      this.spinner.show();
      this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(resp => {
        this.carDetails = resp['data'][0];
        this.spinner.hide();
        if (this.carDetails.disabledDates !== undefined) {
          this.carBookedDates = this.carDetails.disabledDates;
          this.carBookedDates.forEach(element => {
            element.availability.forEach(date => {
              if (date && (moment(moment().format('MM-DD-YYYY'), 'MM-DD-YYYY').unix()
                <= moment(moment(date).format('MM-DD-YYYY'), 'MM-DD-YYYY').unix())) {
                this.bookedDates.push(new Date(date));
              }
            });
          });
        }
        if (this.carDetails.availableData !== undefined) {
          this.carAvailableDates = this.carDetails.availableData;
          const _selectDate = [];
          let minMonth = 12;
          this.carAvailableDates.find((e) => {
            ((e.month < minMonth) && (e.month > new Date().getMonth()))
              ? minMonth = e.month
              : minMonth = minMonth;
          });
          this.carAvailableDates.forEach(element => {
            const edate = [];
            element.availability.forEach(date => {
              if (date && (moment(moment().format('MM-DD-YYYY'), 'MM-DD-YYYY').unix()
                <= moment(moment(date).format('MM-DD-YYYY'), 'MM-DD-YYYY').unix())) {
                _selectDate.push(new Date(date));
              }
            });

            if ((Number(element.month) === Number(moment().format('MM')))) {
              element.availability.forEach(date => {
                if (moment(moment().format('MM-DD-YYYY'), 'MM-DD-YYYY').unix()
                  < moment(moment(new Date(date)).format('MM-DD-YYYY'), 'MM-DD-YYYY').unix()) {
                  edate.push(new Date(date));
                }
              });
              if ((edate.length === (moment(element.month, 'MM').daysInMonth()) -
                Number(moment().format('DD')))) {
                this.availabilitySelectAllArr[element.month - 1].value = true;
              }
            } else {
              if (element.availability.length === moment(element.month, 'MM').daysInMonth()) {
                this.availabilitySelectAllArr[element.month - 1].value = true;
              }
            }
          });
          this.selectDate = [..._selectDate, ...this.bookedDates];
          // this.selectDate = [..._selectDate];
          this.selectedMonth = minMonth - 1;
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
        this.AddEditCarForm.controls['age_of_car'].setValue(this.carDetails.age_of_car);
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
      rent_price: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
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
      age_of_car: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4}')])]
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
      deposit: Number,
      age_of_car: Number
    };
  }

  getDaysInMonth(m, y) {
    const toDay = new Date();
    const toDayMonth = toDay.getMonth();
    var cnt = 1;
    if (toDayMonth === this.selectedMonth) {
      var currentDay = parseInt(moment().format('DD'));
      cnt = currentDay;
    }
    const date = new Date(y, m, cnt);
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

  getDaysInSelectedMonth(selectedmonth, selectedYear) {
    const toDay = new Date();
    const toDayMonth = toDay.getMonth();
    const date = new Date(selectedYear, selectedmonth, 1);
    const _selectDate = (this.selectDate && this.selectDate.length > 0) ? this.selectDate : [];
    if (toDayMonth === this.selectedMonth) {
      var currentDay = parseInt(moment().format('DD'));
      this.cnt = currentDay;
    } else {
      this.cnt = 0;
    }
    var TotalDays;
    var month = selectedmonth + 1;
    if (month < 10) {
      TotalDays = moment(this.selectedYear + '-' + '0' + month, 'YYYY-MM').daysInMonth();
    } else if (month + 1 > 10) {
      TotalDays = moment(this.selectedYear + '-' + month, 'YYYY-MM').daysInMonth();
    }
    while (date.getMonth() === selectedmonth) {
      const _selectDateStr = [];
      const dateMom = moment(date).format('YYYY-MM-DD');
      _selectDate.map((dt) => {
        _selectDateStr.push(moment(dt).format('YYYY-MM-DD'));
      });
      if (_selectDateStr.indexOf(dateMom) > 0) {
        this.cnt++;
      }
      date.setDate(date.getDate() + 1);
    }
    if (this.cnt === TotalDays) {
      this.availabilitySelectAllArr[selectedmonth].value = true;
    } else {
      this.availabilitySelectAllArr[selectedmonth].value = false;
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
          if (file.size > 300000) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please choose Image less then 300 kb' });
            return 0;
          }
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
    this.selectedMonth = new Date().getMonth();
    this.datePicker.overlayVisible = false;
    this.availabilitySelectAllArr = [{ value: false }, { value: false }, { value: false }, { value: false },
    { value: false }, { value: false }, { value: false }, { value: false }, { value: false }, { value: false },
    { value: false }, { value: false }];
    if (this.submitted === true) {
      this.availablityError = true;
    }
  }

  onSubmit() {
    if (this.selectDate !== undefined && this.selectDate !== null) {
      this.availablityError = false;
      const final = [];
      // this.selectDate.forEach(ele => {
      //   if (!(this.bookedDates.indexOf(ele) >= 0)) {
      //     final.push(ele);
      //   }
      // });
      // final.forEach(element => {
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
    this.numberErr = false;
    this.numberErr2 = false;
    this.numberErr3 = false;
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
    formData.append('age_of_car', this.f.age_of_car.value);
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
    this.selectedYear = event.year;
  }

  selectAllDates(event) {
    if (this.availabilitySelectAllArr[this.selectedMonth].value === true) {
      this.getDaysInMonth(this.selectedMonth, this.selectedYear);
      this.availablityError = false;
    } else {
      this.unselectAllDates();
    }
  }

  unselectAllDates() {
    try {
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
          this.selectedMonth = new Date().getMonth();
        }
      }, 0);
    } catch (error) {
      console.log('error => ', error);
    }
  }

  ngOnInit() { }

  keyupRent(event) {
    if (this.AddEditCarForm.controls.rent_price.value !== '' && this.AddEditCarForm.controls.rent_price.value !== null) {
      if (this.AddEditCarForm.controls.rent_price.status === 'INVALID') {
        this.numberErr = true;
      } else {
        this.numberErr = false;
      }
    } else {
      this.numberErr = false;
    }
    if (this.submitted === true) {
      this.numberErr = false;
    }
  }

  restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  keyupDeposit(event) {
    if (this.AddEditCarForm.controls.deposit.value !== '' && this.AddEditCarForm.controls.deposit.value !== null) {
      if (this.AddEditCarForm.controls.deposit.status === 'INVALID') {
        this.numberErr2 = true;
      } else {
        this.numberErr2 = false;
      }
    } else {
      this.numberErr2 = false;
    }
    if (this.submitted === true) {
      this.numberErr2 = false;
    }
  }

  keyupCarAge(event) {
    if (this.AddEditCarForm.controls.age_of_car.value.length > 4) {
      if (this.AddEditCarForm.controls.age_of_car.value !== '' && this.AddEditCarForm.controls.age_of_car.value !== null) {
        if (this.AddEditCarForm.controls.age_of_car.status === 'INVALID') {
          this.numberErr3 = true;
        } else {
          this.numberErr3 = false;
        }
      } else {
        this.numberErr3 = false;
      }
    } else {
      this.numberErr3 = false;
    }

    if (this.submitted === true) {
      this.numberErr3 = false;
    }
  }
}
