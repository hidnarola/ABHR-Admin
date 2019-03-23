import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

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
  public Detail;

  constructor(
    private formbuilder: FormBuilder,
    public service: CrudService,
    public router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    const AdminUser = JSON.parse(localStorage.getItem('admin'));
    this.AdminId = AdminUser._id;
    this.UserType = AdminUser.type;
    this.route.params.subscribe(params => {
      this.Id = params.id;
    });

    this.form = this.formbuilder.group({
      topic: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
    this.formData = {
      topic: String,
      description: String,
    };

    if (this.Id !== undefined && this.Id !== '' && this.Id != null) {
      this.service.post('admin/help/details/', { article_id: this.Id }).subscribe(res => {
        this.Detail = res['data'];
        this.isEdit = true;
        this.form.controls['topic'].setValue(this.Detail.topic);
        this.form.controls['description'].setValue(this.Detail.description);
        this.spinner.hide();
      });
    } else {
      this.isEdit = false;
    }
  }
  get f() { return this.form.controls; }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  ngOnInit() { }

  onSubmit() {
    if (this.form.value.description === null || this.form.value.description === '') {
      this.descriptionError = true;
    } else {
      this.descriptionError = false;
    }
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this.formData = this.form.value;
      this.formData.topic = this.formData.topic.trim();
      this.formData.description = this.formData.description.trim();
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
