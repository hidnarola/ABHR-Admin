import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements AfterViewInit, OnInit {
    subtitle: string;
    public company;
    public companyId;
    totalCars;
    totalRentals;
    currentYear;
    currentMonth;
    currentDate;
    totalDays;
    public days = [];
    public displayDate;
    public graphData = [];
    public transactionData;
    public graphDate;
    public transactionDataArray: Array<any> = [];
    public rentalData;
    public rentalDataArray: Array<any> = [];
    public noRecord: boolean = false;

    constructor(
        private service: CrudService,
        private spinner: NgxSpinnerService,
    ) {
        this.spinner.show();
        this.company = JSON.parse(localStorage.getItem('company-admin'));
        this.companyId = this.company._id;
        this.subtitle = 'This is some text within a card block.'
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        this.currentDate = new Date().getDate();
        this.totalDays = moment(this.currentYear + '-' + (this.currentMonth + 1), 'YYYY-MM').daysInMonth();
        this.getDaysInMOnth(this.currentMonth, this.currentYear);

        this.service.post('company/dashboard/graph', { company_id: this.companyId }).subscribe(res => {
            this.graphData = res['data'];
            if (this.graphData.length !== 0) {
                this.noRecord = false;
                this.graphData.forEach(ele => {
                    this.graphDate = moment(ele.Date).format('DD');
                    if (this.currentDate >= this.graphDate) {
                        this.transactionDataArray.push(ele.transaction_cnt);
                    }
                    this.rentalDataArray.push(ele.rental_cnt);
                    this.spinner.hide();
                });
            } else {
                this.noRecord = true;
                this.days.forEach(e => {
                    if (this.currentDate >= e) {
                        this.transactionDataArray.push(0);
                    }
                    this.rentalDataArray.push(0);
                    this.spinner.hide();
                });
            }
            const chartData = [
                {
                    data: this.transactionDataArray,
                    label: 'Total Transaction'
                },
                {
                    data: this.rentalDataArray,
                    label: 'Total Rentals'
                }
            ];
            this.lineChartData2 = Object.assign([], chartData);
        });

    }
    // This is for the dashboar line chart
    // lineChart
    public lineChartData2: Array<any> = [
        {
            data: [],
            label: 'Total Transaction'
        },
        {
            data: [],
            label: 'Total Rentals'
        }
    ];

    public lineChartLabels2: Array<any> = this.days;

    public lineChartLabels: Array<any> = [
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016'
    ];
    public lineChartOptions: any = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: "rgba(120, 130, 140, 0.13)"
                }
            }],
            xAxes: [{
                gridLines: {
                    color: "rgba(120, 130, 140, 0.13)"
                },
            }]
        },
        responsive: true,
        maintainAspectRatio: false
    };
    public lineChartOptions2: any = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: "rgba(120, 130, 140, 0.13)"
                }
            }],
            xAxes: [{
                gridLines: {
                    color: "rgba(120, 130, 140, 0.13)"
                },
            }]
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { tension: 0 } }
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(25,118,210,0.0)',
            borderColor: 'rgba(25,118,210,1)',
            pointBackgroundColor: 'rgba(25,118,210,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(25,118,210,0.5)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(38,218,210,0.0)',
            borderColor: 'rgba(38,218,210,1)',
            pointBackgroundColor: 'rgba(38,218,210,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(38,218,210,0.5)'
        }

    ];
    public lineChartLegend: boolean = true;
    public lineChartLegend2: boolean = false;
    public lineChartType: string = 'line';

    getDaysInMOnth(m, y) {
        const date = new Date(y, m, 1);
        while (date.getMonth() === m) {
            this.displayDate = moment(date).format('DD');
            this.days.push(this.displayDate);
            date.setDate(date.getDate() + 1);
        }
    }

    ngAfterViewInit() {
        $(".list-task .list-group-item .checkbox label.custom-control").click(function () {
            $(this).toggleClass("task-done");
        });
    }

    ngOnInit() {
        this.service.post('company/dashboard/no_of_cars', { 'company_id': this.companyId }).subscribe(res => {
            this.totalCars = res['data'];
        });
        this.service.post('company/dashboard/no_of_rentals', { 'company_id': this.companyId }).subscribe(res => {
            this.totalRentals = res['data'];
        });
    }

}
