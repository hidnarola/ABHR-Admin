import { Component, OnInit } from '@angular/core';

import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-car',
  templateUrl: './add-edit-car.component.html',
  styleUrls: ['./add-edit-car.component.css']
})
export class AddEditCarComponent implements OnInit {

  AddEditCarForm: FormGroup;
  submitted = false;
  public formData: any;

  constructor(
    private fromBuilder: FormBuilder,
    public service: CrudService,
    private messageService: MessageService,
  ) { 
    //addform validation
    this.AddEditCarForm = this.fromBuilder.group({
      car_rental_company: ['', Validators.required],
      car_rental_company_id : ['', Validators.required],
     //  car_brand: ['', Validators.required],
      car_brand_id: ['', Validators.required],
      car_model: ['', Validators.required],
      car_model_id: ['', Validators.required],
      rent_price: ['', Validators.required],
      no_of_person: ['', Validators.required],
      transmission: ['', Validators.required],
      milage: ['', Validators.required],
      car_class: ['', Validators.required],
     //  car_gallery: ['',],
      driving_eligibility_criteria: ['',[Validators.required, Validators.min(18)]],
     //  is_navigation: [''],
     //  is_AC: [''],
     //  is_luggage_carrier:[''],
      licence_plate: ['', Validators.required],
      car_color: ['', Validators.required]
    });
    console.log('add edit car form', this.AddEditCarForm)
    this.formData = {
     car_rental_company: String,
     car_rental_company_id : Number,
     //car_brand: String,
     car_brand_id: Number,
     car_model: String,
     car_model_id: Number,
     rent_price: Number,
     no_of_person:Number,
     transmission: String,
     milage: String,
     car_class: String,
     //car_gallery: Array,
     // is_navigation: Boolean,
     // is_AC: Boolean,
     // is_luggage_carrier: Boolean,
     driving_eligibility_criteria: Number,
     licence_plate: String,
     car_color: String
    };
  }
  get f() { return this.AddEditCarForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (!this.AddEditCarForm.invalid) {
      //let formData: FormData = new FormData();
      this.formData = this.AddEditCarForm.value;
      console.log('form value' , this.AddEditCarForm.value);
      console.log('formadata in car form==>',this.formData);
      this.service.post('admin/company/car/add',this.formData).subscribe(res =>{
        console.log('res', res)
        this.messageService.add({severity:'success', summary:'Success', detail: res['message'] });
        console.log('messsage ==>', this.messageService.add )
      }, err => {
        err = err.error
        this.messageService.add({severity:'error', summary:'Error', detail: err['message']});
      }
      )
    }
    this.submitted = false;
  }


  ngOnInit() {
    this.AddEditCarForm.controls['car_rental_company'].setValue('');
    this.AddEditCarForm.controls['car_rental_company_id'].setValue('');
    // this.AddEditCarForm.controls['car_brand'].setValue('');
    this.AddEditCarForm.controls['car_brand_id'].setValue('');
    this.AddEditCarForm.controls['car_model'].setValue('');
    this.AddEditCarForm.controls['car_model_id'].setValue('');
    this.AddEditCarForm.controls['rent_price'].setValue('');
    this.AddEditCarForm.controls['no_of_person'].setValue('');
    this.AddEditCarForm.controls['transmission'].setValue('');
    this.AddEditCarForm.controls['milage'].setValue('');
    this.AddEditCarForm.controls['car_class'].setValue('');
    // this.AddEditCarForm.controls['car_gallery'].setValue('');
    this.AddEditCarForm.controls['driving_eligibility_criteria'].setValue('');
    // this.AddEditCarForm.controls['is_navigation'].setValue('');
    // this.AddEditCarForm.controls['is_AC'].setValue('');
    // this.AddEditCarForm.controls['is_luggage_carrier'].setValue('');
    this.AddEditCarForm.controls['licence_plate'].setValue('');
    this.AddEditCarForm.controls['car_color'].setValue('');
  }

}
