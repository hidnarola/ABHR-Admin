import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-company-admin-car-add-edit',
  templateUrl: './company-admin-car-add-edit.component.html',
  styleUrls: ['./company-admin-car-add-edit.component.css']
})
export class CarAddEditComponent implements OnInit {
  CarImage: any = [];
  CarImageRAW: any = [];
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

  constructor(
    private route: ActivatedRoute,
    private fromBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
    public router: Router,
  ) {
    const company = JSON.parse(localStorage.getItem('company-admin'));
    this.companyId = company._id;
    this.companyName = company.name;

    this.route.params.subscribe(params => { this.carId = params.id; });
    console.log('carId==>', this.carId);

    if (this.carId !== undefined && this.carId !== '' && this.carId != null) {
      this.service.post('admin/company/car/details/', { car_id: this.carId }).subscribe(resp => {
        this.carDetails = resp['data'].carDetail;
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
        this.AddEditCarForm.controls['no_of_person'].setValue(this.carDetails.no_of_person);
        this.AddEditCarForm.controls['transmission'].setValue(this.carDetails.transmission);
        this.AddEditCarForm.controls['milage'].setValue(this.carDetails.milage);
        this.AddEditCarForm.controls['car_class'].setValue(this.carDetails.car_class);
        this.AddEditCarForm.controls['car_gallery'].setValue(this.carDetails.car_gallery);
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
    this.AddEditCarForm = this.fromBuilder.group({
      car_rental_company_id: this.companyId,
      car_id: this.carId,
      car_brand_id: ['', Validators.required],
      car_model_id: ['', Validators.required],
      rent_price: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      no_of_person: ['', Validators.required],
      transmission: ['', Validators.required],
      milage: ['', Validators.required],
      car_class: ['', Validators.required],
      car_gallery: [''],
      driving_eligibility_criteria: ['', [Validators.required, Validators.min(18), Validators.max(120),
      Validators.pattern('[0-9]*')]],
      is_navigation: ['', Validators.required],
      is_AC: ['', Validators.required],
      is_luggage_carrier: ['', Validators.required ],
      licence_plate: ['', Validators.required],
      car_color: ['', Validators.required]
    });
    console.log('this.companyId => ', this.companyId);
    this.formData = {
      car_brand_id: String,
      car_model_id: String,
      rent_price: Number,
      no_of_person: Number,
      transmission: String,
      milage: String,
      car_class: String,
      car_gallery: String,
      is_navigation: Boolean,
      is_AC: Boolean,
      is_luggage_carrier: Boolean,
      driving_eligibility_criteria: Number,
      licence_plate: String,
      car_color: String
    };
  }

  modellist = (id) => {
    console.log(id);
  }
  get f() { return this.AddEditCarForm.controls; }

  model(id) {
    // let formdata = [e.brand_ids];
    this.service.post('app/car/modelList', { brand_ids: [id] }).subscribe(res => {
      if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
        this.modelList = res['data'].model;
      } else {
        this.AddEditCarForm.controls['car_model_id'].setErrors({ 'isExist': true });
        // this.modelList = [{ _id: null, model_name: 'No models are available' }];
        this.modelList = [];
      }
    });
  }
  handleFileInput(event) {
    const files = event.target.files;

    if (files) {
      // this.CarImageRAW = files;
      for (const file of files) {
        this.CarImageRAW.push(file);
        // this.CarImageRAW = file;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.CarImage.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditCarForm.invalid) {
      const formData = new FormData();
      formData.append('car_rental_company_id', this.f.car_rental_company_id.value);
      // formData.append('car_id', this.f.car_id.value);
      formData.append('car_brand_id', this.f.car_brand_id.value);
      formData.append('car_model_id', this.f.car_model_id.value);
      formData.append('rent_price', this.f.rent_price.value);
      formData.append('no_of_person', this.f.no_of_person.value);
      formData.append('transmission', this.f.transmission.value);
      formData.append('milage', this.f.milage.value);
      formData.append('car_class', this.f.car_class.value);
      // formData.append('car_gallery', this.f.car_gallery.value);
      formData.append('driving_eligibility_criteria', this.f.driving_eligibility_criteria.value);
      formData.append('is_navigation', this.f.is_navigation.value);
      formData.append('is_AC', this.f.is_AC.value);
      formData.append('is_luggage_carrier', this.f.is_luggage_carrier.value);
      formData.append('licence_plate', this.f.licence_plate.value);
      formData.append('car_color', this.f.car_color.value);
      // formData = this.AddEditCarForm.value;
      formData.append('car_gallery', this.CarImageRAW);
      console.log('this.AddEditCarForm.value => ', this.AddEditCarForm.value);
      console.log('this.CarImageRAW => ', this.CarImageRAW);
      // formData.append('car_rental_company_id', this.companyId);
      if (this.isEdit) {
        this.formData = this.AddEditCarForm.value;
        this.service.post('admin/company/car/edit', this.formData).subscribe(res => {
          console.log('res', res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      } else {
        const headers = new HttpHeaders();
        // this is the important step. You need to set content type as null
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        this.service.post('admin/company/car/add', formData, headers).subscribe(res => {
          console.log('res', res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          // err = err.error;
          console.log('err => ', err);
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      }
    } else {
      return;
    }
    this.isEdit = false;
  }
  ngOnInit() { }

}
