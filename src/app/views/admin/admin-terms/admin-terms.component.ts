import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-admin-terms',
  templateUrl: './admin-terms.component.html',
  styleUrls: ['./admin-terms.component.css']
})
export class AdminTermsComponent implements OnInit, AfterViewInit {

  text: string;
  values = '';
  form: FormGroup;
  submitted = false;
  public formData: any;
  subtitle: string;
  constructor(
    private formbuilder: FormBuilder,
  ) {
    this.form = this.formbuilder.group({
      terms_and_condition: ['']
    });
    this.formData = {
      terms_and_condition: String,
    };
    console.log('form data', this.formData);
  }

  ngOnInit() {
  }

  ngAfterViewInit() { }

  onSubmit() {
    this.submitted = true;
    console.log('terms&condition', [this.formData]);
    console.log('form value => ', this.form.value);
  }
}
