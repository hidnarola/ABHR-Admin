import { Component, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { DataSharingService } from '../services/data-sharing.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CrudService } from '../services/crud.service';
import { MustMatch } from '../helpers/must-match.validator';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  display: boolean = false;
  displayVAT: boolean = false;
  user;
  public CurrentAdmin;
  public company;
  name: string;
  public AdminName;
  public AdminType;
  public AdminEmail;
  public AdminNumber;
  public VATData;
  public config: PerfectScrollbarConfigInterface = {};
  changePassForm: FormGroup;
  // VATForm: FormGroup;
  closeResult: string;
  public formData: any;
  // public VATformData: any;
  submitted = false;
  public companyId;
  isLoading: boolean;
  public passwordData: any;
  public numberMask = createNumberMask({
    prefix: '',
    suffix: '%',
    includeThousandsSeparator: false,
    allowDecimal: true,
    integerLimit: 2,
    decimalLimit: 1,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });

  constructor(
    private datashare: DataSharingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private service: CrudService,
  ) {
    // change pass form
    this.changePassForm = this.formBuilder.group({
      old_password: ['', Validators.compose([Validators.required, this.passwordMatchValidator])],
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(13)])],
      repeat_new_password: ['', Validators.required],
    },
      {
        validator: MustMatch('new_password', 'repeat_new_password')
      });
    this.formData = {
      old_password: String,
      new_password: String,
      repeat_new_password: String
    };

    const urlSegment = this.router.url;
    const array = urlSegment.split('/');
    this.CurrentAdmin = array[1];
    this.datashare.currentAdminUser.subscribe((res) => {
      var user = JSON.parse(localStorage.getItem('admin'));
      var company = JSON.parse(localStorage.getItem('company-admin'));

      if (user != null && user !== undefined) {
        this.AdminName = user.first_name + ' ' + user.last_name;
        this.AdminEmail = user.email;
        this.AdminNumber = user.phone_number;
        this.AdminType = 'admin';
      }
      if (company != null && company !== undefined) {
        this.AdminName = company.name;
        this.AdminEmail = company.email;
        this.AdminNumber = company.phone_number;
        this.AdminType = 'company_admin';
        this.companyId = company._id;
        console.log('company => ', this.companyId);
      }
      if (company == null && company === undefined && user == null && user === undefined) {
        this.AdminName = 'Admin';
        this.AdminEmail = 'dse@narola.email';
        this.AdminNumber = '9654788458';
      }
    });

    this.service.get('admin/vat').subscribe(res => {
      this.VATData = res['result'].rate + '%';
    });
  }

  // This is for Notifications
  notifications: Object[] = [{
    round: 'round-danger',
    icon: 'ti-link',
    title: 'Luanch Admin',
    subject: 'Just see the my new admin!',
    time: '9:30 AM'
  }, {
    round: 'round-success',
    icon: 'ti-calendar',
    title: 'Event today',
    subject: 'Just a reminder that you have event',
    time: '9:10 AM'
  }, {
    round: 'round-info',
    icon: 'ti-settings',
    title: 'Settings',
    subject: 'You can customize this template as you want',
    time: '9:08 AM'
  }, {
    round: 'round-primary',
    icon: 'ti-user',
    title: 'Pavan kumar',
    subject: 'Just see the my admin!',
    time: '9:00 AM'
  }];

  // This is for Mymessages
  mymessages: Object[] = [{
    useravatar: 'assets/images/users/1.jpg',
    status: 'online',
    from: 'Pavan kumar',
    subject: 'Just see the my admin!',
    time: '9:30 AM'
  }, {
    useravatar: 'assets/images/users/2.jpg',
    status: 'busy',
    from: 'Sonu Nigam',
    subject: 'I have sung a song! See you at',
    time: '9:10 AM'
  }, {
    useravatar: 'assets/images/users/2.jpg',
    status: 'away',
    from: 'Arijit Sinh',
    subject: 'I am a singer!',
    time: '9:08 AM'
  }, {
    useravatar: 'assets/images/users/4.jpg',
    status: 'offline',
    from: 'Pavan kumar',
    subject: 'Just see the my admin!',
    time: '9:00 AM'
  }];
  ngAfterViewInit() {
    const set = function () {
      const width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
      const topOffset = 0;
      if (width < 1170) {
        $('#main-wrapper').addClass('mini-sidebar');
      } else {
        $('#main-wrapper').removeClass('mini-sidebar');
      }
    };
    $(window).ready(set);
    $(window).on('resize', set);
    $('.search-box a, .search-box .app-search .srh-btn').on('click', function () {
      $('.app-search').toggle(200);
    });
    $('body').trigger('resize');
  }

  logout() {
    localStorage.clear();
    if (this.CurrentAdmin === 'admin') {
      this.router.navigate(['/admin/login']);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logout Successfully' });
    } else if (this.CurrentAdmin === 'company') {
      this.router.navigate(['/company/login']);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logout Successfully' });
    } else {
      this.router.navigate(['/admin/login']);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logout Successfully' });
    }
  }
  get f() { return this.changePassForm.controls; }
  // get fVAT() { return this.VATForm.controls; }

  public passwordMatchValidator = (control: FormControl) => {
    let isWhitespace2;
    if ((isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      console.log('control.value => ', control.value);
      this.passwordData = { 'password': control.value, 'company_id': this.companyId };
      console.log('passwordData===>', this.passwordData);
      return this.service.post('company/check_password', this.passwordData).subscribe(res => {
        console.log('res pass check', res);
        if (res['status'] === 'failed') {
          this.f.old_password.setErrors({ 'matchPass': true });
          return;
        } else {
          this.f.old_password.setErrors(null);
        }
      }
      );
    }
  }

  showDialog() {
    this.display = true;
    this.changePassForm.controls['old_password'].setValue('');
    this.changePassForm.controls['new_password'].setValue('');
    this.changePassForm.controls['repeat_new_password'].setValue('');
    this.submitted = false;
  }

  showVATDialog() {
    this.displayVAT = true;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.changePassForm.invalid) {
      this.isLoading = true;
      this.formData = this.changePassForm.value;
      this.formData.company_id = this.companyId;
      this.service.post('company/change_password', this.formData).subscribe(res => {
        this.display = false;
        this.submitted = false;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        err = err.error;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        this.display = false;
        // this.closePopup();
        this.submitted = false;
        this.isLoading = false;
      });
      this.submitted = false;
      this.changePassForm.controls['old_password'].setValue('');
      this.changePassForm.controls['new_password'].setValue('');
      this.changePassForm.controls['repeat_new_password'].setValue('');
    }
  }

  onVATSubmit() {
    this.submitted = true;
    this.isLoading = false;
    console.log('VATForm.form===>', this.VATData);
    console.log('type of VATForm.form===>', typeof this.VATData);
    if (typeof this.VATData === 'string') {
      var rate = parseInt(this.VATData.split('%')[0]);
    } else if (typeof this.VATData === 'number') {
      var rate = this.VATData;
    }
    var obj = {
      'rate': rate
    };
    console.log('obj => ', obj);
    this.service.put('admin/vat/update', obj).subscribe(res => {
      this.displayVAT = false;
      this.submitted = false;
      this.isLoading = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
    }, err => {
      err = err.error;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      this.display = false;
      this.submitted = false;
      this.isLoading = false;
    });

  }

}
