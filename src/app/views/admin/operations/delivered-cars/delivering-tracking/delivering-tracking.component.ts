import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-delivering-tracking',
  templateUrl: './delivering-tracking.component.html',
  styleUrls: ['./delivering-tracking.component.css']
})
export class DeliveringTrackingComponent implements OnInit, AfterViewInit, OnDestroy {

  x = 0.000010;
  msg: any;
  bookingId: any;
  userId: any;
  private socket;

  // google maps zoom level
  zoom = 16;

  // initial center position for the map 21.203406,72.810435
  lat = 21.203406;
  lng = 72.810435;

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
    private router: Router, private route: ActivatedRoute
  ) { }

  markers: Marker[] = [];
  clickedMarker(label: string, index: number) { }

  mapClicked($event: MouseEvent) { }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  ngOnDestroy() {
    this.leftGroup();
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
    this.getCurrentPosition();
  }
  ngAfterViewInit(): void { }

  setCurrentPosition() {
    const _lng = this.lng;
    const _lat = this.lat;
    const marker = [{
      lat: _lat,
      lng: _lng,
      iconUrl: 'assets/images/icon/car-placeholder-30-blue.png',
      draggable: false
    }];
    this.markers = marker;
  }


  getDirection(origin, destination) {
    this.origin = { lat: origin.latitude, lng: origin.longitude };
    this.destination = { lat: destination.latitude, lng: destination.longitude };
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
    this.socket.on('Joined', (data: any) => {
      this.lat = data.last_location.latitude;
      this.lng = data.last_location.longitude;
      this.setCurrentPosition();
      this.getDirection(data.source_location, data.destination_location);
    });
  }
  getCurrentPosition() {
    this.socket.on('recieveTrackingObject', (data: any) => {
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
