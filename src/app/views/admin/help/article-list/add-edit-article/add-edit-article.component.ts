import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-article',
  templateUrl: './add-edit-article.component.html',
  styleUrls: ['./add-edit-article.component.css']
})
export class AddEditArticleComponent implements OnInit {

  public termsData;
  text: string;
  values = '';
  form: FormGroup;
  submitted = false;
  public formData: any;
  subtitle: string;
  isLoading: boolean;
  public Id;
  public isEdit: boolean;
  public title = 'Add Article';
  public descriptionError: boolean = false;
  public AdminId;
  public UserType;

  constructor(
    private formbuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    const AdminUser = JSON.parse(localStorage.getItem('admin'));
    this.AdminId = AdminUser._id;
    this.UserType = AdminUser.type;
    this.route.params.subscribe(params => {
      this.Id = params.id;
      console.log('this.Id => ', this.Id);
      if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    });

    this.form = this.formbuilder.group({
      topic: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.formData = {
      topic: String,
      description: String,
    };
    console.log('form data', this.formData);
  }
  get f() { return this.form.controls; }

  ngOnInit() { }

  onSubmit() {
    if (this.form.value.description === null || this.form.value.description === '') {
      this.descriptionError = true;
    } else {
      this.descriptionError = false;
    }
    this.submitted = true;
    console.log('this.form.valid => ', this.form.valid);
    if (this.form.valid) {
      this.isLoading = true;
      this.formData = this.form.value;
      if (this.isEdit) {
        this.formData.article_id = this.Id;
        this.isLoading = true;
        this.service.put('admin/help/update', this.formData).subscribe(res => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/admin/help/article-list']);
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        });
      } else {
        this.formData.userId = this.AdminId;
        this.formData.userType = this.UserType;
        console.log('this.formData => ', this.formData);
        this.isLoading = true;
        this.service.post('admin/help/add', this.formData).subscribe(res => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          this.router.navigate(['/admin/help/article-list']);
        }, err => {
          err = err.error;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        }
        );
      }

    }
  }

}
