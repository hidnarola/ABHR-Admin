import { Component, OnInit, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-delivered-cars',
  templateUrl: './delivered-cars.component.html',
  styleUrls: ['./delivered-cars.component.css']
})

@Injectable()
export class DeliveredCarsComponent implements OnInit {

  constructor(
    private socket: Socket
  ) { }

  getMessage() {
    console.log('this.socket => ', this.socket);
    return this.socket;
  }

  ngOnInit() {
  }

}
