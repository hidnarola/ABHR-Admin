import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

// import { Socket } from 'ngx-socket-io';
// import { SocketClass } from '../../../../../shared/classes/socket.class';
@Component({
  selector: 'app-delivered-tracking',
  templateUrl: './delivered-tracking.component.html',
  styleUrls: ['./delivered-tracking.component.css']
})
export class DeliveredTrackingComponent implements OnInit, AfterViewInit {

  msg: any;
  bookingId: any;
  userId: any;
  private socket;

  // google maps zoom level
  zoom = 16;

  // initial center position for the map 21.1968399,72.7789305
  lat = 21.1968399;
  lng = 72.7789305;

  public origin: any;
  public destination: any;

  public waypoints: any = [];
  public renderOptions = {
    draggable: false,
    suppressMarkers: true,
  };

  public markerOptions = {
    origin: {
      icon: 'assets/images/icon/car-placeholder-30-green.png',
      draggable: false,
    },
    destination: {
      icon: 'assets/images/icon/car-placeholder-30-red.png',
      label: '',
      opacity: 0.8,
      draggable: false,
    },
  };
  constructor(
    // private socket: SocketClass,
    private router: Router, private route: ActivatedRoute
  ) { }

  markers: Marker[] = [
  ];
  clickedMarker(label: string, index: number) {
    // console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  ngOnInit() {
    const user: any = JSON.parse(localStorage.getItem('admin'));
    this.userId = user._id;
    this.route.params.subscribe(param => {
      this.bookingId = param.id;
    });
    this.msg = 'Map';
    this.socket = io.connect(environment.socketUrl);
    this.joinGroup(this.bookingId, this.userId, 'user');
    // this.sendMessage('KP is here.');
    this.getCurrentPosition();
    this.getDirection();
    this.setCurrentPosition();
  }
  ngAfterViewInit(): void { }

  setCurrentPosition() {
    const _lng = this.lng;
    const _lat = this.lat;
    // setInterval(() => {
    // _lng = _lng + Math.random() / 10000;
    // _lat = _lat - Math.random() / 10000;
    const marker = [{
      lat: _lat,
      lng: _lng,
      iconUrl: 'assets/images/icon/car-placeholder-30-blue.png',
      draggable: false
    }];
    this.lat = _lat;
    this.lng = _lng;
    this.markers = marker;
    // }, 2000);
  }

  public change(event: any) {
    this.waypoints = event.request.waypoints;
  }
  getDirection() {
    // 21.1968399,72.7789305   21.1205296,72.7409003   21.1298389,73.0863185
    this.origin = { lat: 21.1968399, lng: 72.7789305 };
    this.destination = { lat: 21.1298389, lng: 73.0863185 };
    // this.origin = 'Taipei Main Station';
    // this.destination = 'Taiwan Presidential Office';
  }
  leftGroup() {
    this.socket.emit('LeftGroup');
  }
  sendMessage(msg: string) {
    this.socket.emit('sendTrakingObject', {
      'Longitude': 123.45,
      'Latitude': 22.22,
      'booking_id': '5c34874db8914204105b7c54',
      'agent_id': '5c34874db8914204105b7c54'
    });
  }

  joinGroup = (bid, uid, type) => {
    const params = {
      booking_id: bid,
      user_id: uid,
      type: type
    };
    this.socket.emit('JoinGroup', params);
  }

  getCurrentPosition() {
    this.socket.on('recieveTrackingObjest', (data: any) => {
      console.log('data => ', data);
      this.lat = data.Latitude;
      this.lng = data.Longitude;
    });
  }

}

// just an interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  iconUrl?: string;
  draggable: boolean;
}
