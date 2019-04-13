import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { DataSharingService, CompanyPassword, AdminPassword } from '../services/data-sharing.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CrudService } from '../services/crud.service';
import { MustMatch } from '../helpers/must-match.validator';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
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
  closeResult: string;
  public formData: any;
  submitted = false;
  public companyId;
  public adminId;
  isLoading: boolean;
  public passwordData: any;
  public numberMask = createNumberMask({
    prefix: '',
    suffix: '%',
    includeThousandsSeparator: false,
    allowDecimal: true,
    integerLimit: 2,
    decimalLimit: 10,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  });
  public companyPass: CompanyPassword;
  public adminPass: AdminPassword;
  public passErr: boolean = false;
  public repeatPassErr: boolean = false;

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
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(6),
      Validators.maxLength(13), this.noWhitespaceValidator])],
      repeat_new_password: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
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
        this.adminId = user._id;
      }
      if (company != null && company !== undefined) {
        this.AdminName = company.name;
        this.AdminEmail = company.email;
        this.AdminNumber = company.phone_number;
        this.AdminType = 'company_admin';
        this.companyId = company._id;
      }
      if (company == null && company === undefined && user == null && user === undefined) {
        this.AdminName = 'Admin';
        this.AdminEmail = 'dse@narola.email';
        this.AdminNumber = '9654788458';
      }
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

  public passwordMatchValidator = (control: FormControl) => {
    let isWhitespace2;
    if ((isWhitespace2 = (control.value || '').trim().length === 1) || (isWhitespace2 = (control.value || '').trim().length === 0)) {
      return { 'required': true };
    } else {
      if (this.CurrentAdmin === 'company') {
        this.passwordData = { 'password': control.value, 'company_id': this.companyId };
        return this.service.post('company/check_password', this.passwordData).subscribe(res => {
          if (res['status'] === 'failed') {
            this.f.old_password.setErrors({ 'matchPass': true });
            return;
          } else {
            this.f.old_password.setErrors(null);
          }
        }
        );
      } else {
        this.passwordData = { 'password': control.value, 'user_id': this.adminId };
        return this.service.post('admin/check_password', this.passwordData).subscribe(res => {
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
  }

  showDialog() {
    this.display = true;
    this.passErr = false;
    this.changePassForm.controls['old_password'].setValue('');
    this.changePassForm.controls['new_password'].setValue('');
    this.changePassForm.controls['repeat_new_password'].setValue('');
    this.submitted = false;
  }

  showVATDialog() {
    this.service.get('admin/vat').subscribe(res => {
      this.VATData = res['result'].rate + '%';
    });
    setTimeout(() => {
      this.displayVAT = true;
    }, 500);
  }

  onSubmit() {
    this.submitted = true;
    console.log('this.changePassForm.controls => ', this.changePassForm.controls);
    // if (this.changePassForm.controls.new_password.errors.minlength !== undefined ||
    //   this.changePassForm.controls.new_password.errors.maxlength !== undefined) {
    //   console.log('not undefined => ');
    //   if ((this.changePassForm.controls.new_password.errors.minlength.actualLength < 6) ||
    //     (this.changePassForm.controls.new_password.errors.minlength.actualLength > 13)) {
    //     this.passErr = false;
    //   } else {
    //     this.passErr = true;
    //   }
    // }
    // if (this.changePassForm.controls.new_password.value.length > 5 && this.changePassForm.controls.new_password.value.length < 14) {
    //   this.passErr = true;
    // } else {
    //   this.passErr = false;
    // }
    if (!this.changePassForm.invalid) {
      this.isLoading = true;
      this.formData = this.changePassForm.value;
      if (this.CurrentAdmin === 'company') {
        this.formData.company_id = this.companyId;
        this.service.post('company/change_password', this.formData).subscribe(res => {
          this.display = false;
          this.submitted = false;
          this.isLoading = false;
          var company = JSON.parse(localStorage.getItem('company-admin'));
          company.password = res['password'];
          localStorage.setItem('company-admin', JSON.stringify(company));
          this.companyPass = {
            password: res['password'],
          };
          this.datashare.changeCompanyPassword(this.companyPass);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.display = false;
          // this.closePopup();
          this.submitted = false;
          this.isLoading = false;
        });
      } else {
        this.formData.user_id = this.adminId;
        this.service.post('admin/change_password', this.formData).subscribe(res => {
          this.display = false;
          this.submitted = false;
          this.isLoading = false;
          var admin = JSON.parse(localStorage.getItem('admin'));
          admin.password = res['password'];
          localStorage.setItem('admin', JSON.stringify(admin));
          this.adminPass = {
            password: res['password'],
          };
          this.datashare.changeAdminPassword(this.adminPass);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        }, err => {
          err = err.error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
          this.display = false;
          // this.closePopup();
          this.submitted = false;
          this.isLoading = false;
        });
      }


      this.submitted = false;
      this.changePassForm.controls['old_password'].setValue('');
      this.changePassForm.controls['new_password'].setValue('');
      this.changePassForm.controls['repeat_new_password'].setValue('');
    }
  }

  onVATSubmit() {
    this.submitted = true;
    this.isLoading = false;
    if (typeof this.VATData === 'string') {
      var rate = parseInt(this.VATData.split('%')[0]);
    } else if (typeof this.VATData === 'number') {
      var rate = this.VATData;
    }
    var obj = {
      'rate': rate
    };
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

  ngOnDestroy(): void { }

  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
    // return isValid ? null : { 'null': true };
  }

  // keyupPass() {
  //   if ((this.changePassForm.value.new_password.length > 0)
  //     && (this.changePassForm.controls.new_password.value.trim().length === 0)) {
  //     if (this.submitted === true) {
  //       if (this.changePassForm.controls.new_password.value.length > 5 && this.changePassForm.controls.new_password.value.length < 14) {
  //         this.passErr = true;
  //       } else {
  //         this.passErr = false;
  //       }
  //     } else {
  //       this.passErr = true;
  //     }
  //   } else {
  //     this.passErr = false;
  //   }
  // }

  // keyupRepeatPass() {
  //   console.log('reset pass keyup => ');
  //   console.log('chng pass form => ', this.changePassForm.value.repeat_new_password);
  // }

}
