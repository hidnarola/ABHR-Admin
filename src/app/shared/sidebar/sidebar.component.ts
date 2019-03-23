import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { COMPANY_ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataSharingService } from '../services/data-sharing.service';
declare var $: any;
@Component({
    selector: 'ap-sidebar',
    templateUrl: './sidebar.component.html'

})
export class SidebarComponent implements OnInit {

    public currentUser;
    showMenu: string = '';
    showSubMenu: string = '';
    public sidebarnavItems: any[];
    public AdminType;
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';

        } else {
            this.showMenu = element;
        }
    }
    addActiveClass(element: any) {
        if (element === this.showSubMenu) {
            this.showSubMenu = '0';

        } else {
            this.showSubMenu = element;
        }
    }

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private datashare: DataSharingService
    ) {
        var user = JSON.parse(localStorage.getItem('admin'));
        let company = JSON.parse(localStorage.getItem('company-admin'));
        if (user != null && user !== undefined) {
            this.AdminType = user.first_name;
        }
        if (company != null && company !== undefined) {
            this.AdminType = company.name;
        }
        if (company == null && company === undefined && user == null && user === undefined) {
            this.AdminType = 'Admin';
        }
        var urlSegment = this.router.url;
        var array = urlSegment.split('/');
        this.currentUser = array[1];
    }
    // End open close
    ngOnInit() {
        if (this.currentUser === 'admin') {
            this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
            $(function () {
                $('.sidebartoggler, .sidebar-menu-item').on('click', function () {
                    if ($(this).is('.sidebar-menu-item') && window.screen.availWidth > 767) {
                        return;
                    }
                    if ($('#main-wrapper').hasClass('mini-sidebar')) {
                        $('body').trigger('resize');
                        $('#main-wrapper').removeClass('mini-sidebar');
                    } else {
                        $('body').trigger('resize');
                        $('#main-wrapper').addClass('mini-sidebar');
                    }
                });
            });


        } else if (this.currentUser === 'company') {
            this.sidebarnavItems = COMPANY_ROUTES.filter(sidebarnavItem => sidebarnavItem);
            $(function () {
                $('.sidebartoggler, .sidebar-menu-item').on('click', function () {
                    if ($(this).is('.sidebar-menu-item') && window.screen.availWidth > 767) {
                        return;
                    }
                    if ($('#main-wrapper').hasClass('mini-sidebar')) {
                        $('body').trigger('resize');
                        $('#main-wrapper').removeClass('mini-sidebar');

                    } else {
                        $('body').trigger('resize');
                        $('#main-wrapper').addClass('mini-sidebar');
                    }
                });
            });
        }
    }


    logout() {
        if (this.currentUser === 'admin') {
            localStorage.clear();
            this.router.navigate(['/admin/login']);
        } else if (this.currentUser === 'company') {
            localStorage.clear();
            this.router.navigate(['/company/login']);
        }
    }

}
