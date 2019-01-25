import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbPanelChangeEvent, NgbCarouselConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { DataSharingService } from '../services/data-sharing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CrudService } from '../services/crud.service';
import { MustMatch } from '../helpers/must-match.validator';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  user;
  public CurrentAdmin;
  public company;
  name: string;
  public AdminName;
  public AdminType;
  public AdminEmail;
  public AdminNumber;
  public config: PerfectScrollbarConfigInterface = {};
  changePassForm: FormGroup;
  closeResult: string;
  public formData: any;
  submitted = false;
  public companyId;
  isLoading: boolean;

  constructor(private modalService: NgbModal,
    private datashare: DataSharingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private service: CrudService,
  ) {
    this.changePassForm = this.formBuilder.group({
      old_password: ['', Validators.required],
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
      console.log('user type in nav bar===>', user);
      var company = JSON.parse(localStorage.getItem('company-admin'));

      console.log('company => ', this.companyId);
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
    } else if (this.CurrentAdmin === 'company') {
      this.router.navigate(['/company/login']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  closePopup() {
    const element = document.getElementById('closepopup');
    element.click();
  }
  get f() { return this.changePassForm.controls; }
  open2(content, item) {
    console.log('item====>', item);
    if (item !== 'undefined' && item) {
      this.changePassForm.controls['old_password'].setValue(item.old_password);
      this.changePassForm.controls['new_password'].setValue(item.new_password);
      this.changePassForm.controls['repeat_new_password'].setValue(item.repeat_new_password);
    }
    const options: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static'
    };
    this.modalService.open(content, options).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.changePassForm.invalid) {
      this.isLoading = true;
      this.formData = this.changePassForm.value;
      this.formData.company_id = this.companyId;
      console.log('company => ', this.companyId);
      this.service.post('company/change_password', this.formData).subscribe(res => {
        this.closePopup();
        this.submitted = false;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
        console.log('if => ');
      }, err => {
        err = err.error;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
        this.closePopup();
        this.submitted = false;
        this.isLoading = false;
        console.log(' err=> ');
      });
      this.submitted = false;
      // this.isLoading = false;
      console.log('else => ');
      this.changePassForm.controls['old_password'].setValue('');
      this.changePassForm.controls['new_password'].setValue('');
      this.changePassForm.controls['repeat_new_password'].setValue('');
    }
  }

}
