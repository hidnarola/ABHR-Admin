import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { COMPANY_ROUTES } from './menu-items';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
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
    //this is for the open close
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
    
    constructor(private modalService: NgbModal, private router: Router,
        private route: ActivatedRoute) {
            var urlSegment = this.router.url;
            var array = urlSegment.split('/');
            console.log(array[1]);
            this.currentUser = array[1];
            console.log('current user', this.currentUser)
           console.log('url', this.router.url)      
    } 
    // End open close
    ngOnInit() {
        if(this.currentUser == 'admin'){
        this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
        $(function () {
            $(".sidebartoggler").on('click', function() {
                if ($("#main-wrapper").hasClass("mini-sidebar")) {
                    $("body").trigger("resize");
                    $("#main-wrapper").removeClass("mini-sidebar");
                     
                } else {
                    $("body").trigger("resize");
                    $("#main-wrapper").addClass("mini-sidebar");
                }
            });
        });  
    } else if(this.currentUser == 'company'){
        this.sidebarnavItems = COMPANY_ROUTES.filter(sidebarnavItem => sidebarnavItem);
        $(function () {
            $(".sidebartoggler").on('click', function() {
                if ($("#main-wrapper").hasClass("mini-sidebar")) {
                    $("body").trigger("resize");
                    $("#main-wrapper").removeClass("mini-sidebar");
                     
                } else {
                    $("body").trigger("resize");
                    $("#main-wrapper").addClass("mini-sidebar");
                }
            });
        });  
    }
}

    logout() {
        if(this.currentUser == 'admin'){
        localStorage.clear();
        this.router.navigate(['/admin/login']);
    } else if(this.currentUser == 'company'){
        localStorage.clear();
        this.router.navigate(['/company/login']);
    }
      }

}
