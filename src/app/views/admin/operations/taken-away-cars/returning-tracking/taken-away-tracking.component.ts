import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taken-away-tracking',
  templateUrl: './taken-away-tracking.component.html',
  styleUrls: ['./taken-away-tracking.component.css']
})
export class TakenAwayTrackingComponent implements OnInit, AfterViewInit {
  x = 0.0010;
  msg: any;
  bookingId: any;
  userId: any;
  private socket;
  // google maps zoom level
  zoom = 16;

  // initial center position for the map 21.203406,72.810435
  lat = 21.203406;
  lng = 72.810435;

  public origin: any = {};
  public destination: any = {};

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
    this.getMessage();
    // this.sendMessage('KP is here.');

    // this.setCurrentPosition();
  }
  ngAfterViewInit(): void { this.getCurrentPosition(); }

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
    // this.lat = _lat;
    // this.lng = _lng;
    this.markers = marker;
    // }, 2000);
  }

  getDirection(origin, destination) {
    // 21.1968399,72.7789305   21.1205296,72.7409003   21.1298389,73.0863185
    // 21.195531,72.7906113 21.2050025,72.8384902
    this.origin = { lat: origin.latitude, lng: origin.longitude };
    this.destination = { lat: destination.latitude, lng: destination.longitude };
    // this.origin = 'Narola Infotech';
    // this.destination = 'Railway Station';
  }
  leftGroup() {
    this.socket.emit('LeftGroup');
  }
  sendMessage() {
    this.socket.emit('sendTrakingObject', {
      'Latitude': 21.203406 + this.x,
      'Longitude': 72.7906113 + this.x,
      'booking_id': '5c5e648a0176bd60fad21fe0',
      'agent_id': '5c5d0d8aba8ed64fe579dc9d'
    });
    this.x += 0.0010;
  }

  joinGroup = (bid, uid, type) => {
    const params = {
      booking_id: bid,
      user_id: uid,
      type: type
    };
    this.socket.emit('JoinGroup', params);
  }

  getMessage() {
    // console.log('im getMSG   => ', 1);
    this.socket.on('Joined', (data: any) => {
      // this.socket.on('test', (data: any) => {
      this.lat = data.last_location.latitude;
      this.lng = data.last_location.longitude;
      this.setCurrentPosition();
      console.log('Joined data => ', data);
      this.getDirection(data.destination_location, data.source_location);
    });
  }
  getCurrentPosition() {
    this.socket.on('recieveTrackingObject', (data: any) => {
      console.log('Current Location data => ', data);
      this.lat = data.Latitude;
      this.lng = data.Longitude;
      this.setCurrentPosition();
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