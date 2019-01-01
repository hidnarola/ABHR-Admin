import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';

@Component({
  selector: 'app-company-admin-car-add-edit',
  templateUrl: './company-admin-car-add-edit.component.html',
  styleUrls: ['./company-admin-car-add-edit.component.css']
})
export class CarAddEditComponent implements OnInit {

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

    this.route.params.subscribe(params =>  { this.carId = params.id;  });
    console.log('carId==>', this.carId);

    this.isEdit = true;
    if (this.carId !== undefined && this.carId !== '' && this.carId != null) {
      this.service.post('admin/company/car/details/', { car_id : this.carId}).subscribe ( res => {
        this.carDetails = res['data'].carDetail;
        console.log('edit form', this.carDetails);
        this.service.post('app/car/modelList', {brand_ids: [this.carDetails.car_brand_id]}).subscribe ( res => {
          if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
            this.modelList = res['data'].model;
          } else {
            this.modelList = [{ _id: null, model_name: 'No models are available'}];
          }
        });
        this.AddEditCarForm.controls['car_brand_id'].setValue(this.carDetails.car_brand_id);
        this.AddEditCarForm.controls['car_model_id'].setValue(this.carDetails.car_model_id);
        this.AddEditCarForm.controls['rent_price'].setValue(this.carDetails.rent_price);
        this.AddEditCarForm.controls['no_of_person'].setValue(this.carDetails.no_of_person);
        this.AddEditCarForm.controls['transmission'].setValue(this.carDetails.transmission);
        this.AddEditCarForm.controls['milage'].setValue(this.carDetails.milage);
        this.AddEditCarForm.controls['car_class'].setValue(this.carDetails.car_class);
        // this.AddEditCarForm.controls['car_gallery'].setValue('');
        this.AddEditCarForm.controls['driving_eligibility_criteria'].setValue(this.carDetails.driving_eligibility_criteria);
        this.AddEditCarForm.controls['is_navigation'].setValue(this.carDetails.is_navigation);
        this.AddEditCarForm.controls['is_AC'].setValue(this.carDetails.is_AC);
        this.AddEditCarForm.controls['is_luggage_carrier'].setValue(this.carDetails.is_luggage_carrier);
        this.AddEditCarForm.controls['licence_plate'].setValue(this.carDetails.licence_plate);
        this.AddEditCarForm.controls['car_color'].setValue(this.carDetails.car_color);
      });
    }
    this.service.get('app/car/brandlist').subscribe ( res => {
      this.brandlist = res['data'].brand;
    });

      // addform validation
      this.AddEditCarForm = this.fromBuilder.group({
        car_rental_company_id: this.companyId ,
        car_id: this.carId,
        car_brand_id: ['', Validators.required],
        car_model_id: ['', Validators.required],
        rent_price: ['', Validators.required],
        no_of_person: ['', Validators.required],
        transmission: ['', Validators.required],
        milage: ['', Validators.required],
        car_class: ['', Validators.required],
       //  car_gallery: ['',],
        driving_eligibility_criteria: ['', [Validators.required, Validators.min(18)]],
        is_navigation: ['' ],
        is_AC: [''],
        is_luggage_carrier: [''],
        licence_plate: ['', Validators.required],
        car_color: ['', Validators.required]
      });
      this.formData = {
       car_brand_id: String,
       car_model_id: String,
       rent_price: Number,
       no_of_person: Number,
       transmission: String,
       milage: String,
       car_class: String,
       // car_gallery: Array,
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
    this.service.post('app/car/modelList', {brand_ids: [id]}).subscribe ( res => {
      if ((res['data'] !== undefined) && (res['data'] != null) && res['data']) {
        this.modelList = res['data'].model;
      } else {
        this.modelList = [{ _id: null, model_name: 'No models are available'}];
      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.AddEditCarForm.invalid) {
      this.formData = this.AddEditCarForm.value;
      console.log('value of form==>', this.AddEditCarForm);
      if (this.isEdit) {
        this.service.post('admin/company/car/edit', this.formData).subscribe(res => {
          console.log('res', res);
          this.messageService.add({severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          err = err.error;
          this.messageService.add({severity: 'error', summary: 'Error', detail: err['message']});
        }
        );
      } else {
        this.service.post('admin/company/car/add', this.formData).subscribe(res => {
          console.log('res', res);
          this.messageService.add({severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/company/car']);
        }, err => {
          err = err.error;
          this.messageService.add({severity: 'error', summary: 'Error', detail: err['message']});
        }
        );
      }
    } else {
      return;
    }
  }
  ngOnInit() { }

}
