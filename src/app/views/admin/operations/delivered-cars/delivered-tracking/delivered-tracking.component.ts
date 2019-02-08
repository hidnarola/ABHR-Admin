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

  // initial center position for the map
  lat = 51.673858;
  lng = 7.815982;
  constructor(
    // private socket: SocketClass,
    private router: Router, private route: ActivatedRoute
  ) { }

  markers: Marker[] = [
  ];
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
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
    this.msg = 'hi';
    this.socket = io.connect(environment.socketUrl);
    this.joinGroup(this.bookingId, this.userId, 'user');
    // this.sendMessage('KP is here.');
    console.log('message => ', this.getMessage());
  }
  ngAfterViewInit(): void {
    let _lng = this.lng;
    setInterval(() => {
      _lng = _lng + 0.0001;
      console.log('_lng => ', _lng);
      const marker = [{
        lat: 51.673858,
        lng: _lng,
        label: '',
        draggable: false
      }];
      this.lat = marker[0].lat;
      this.lng = _lng;
      this.markers = marker;
    }, 2000);
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

  getMessage() {
    return this.socket.on('receiveTrakingObject', (data: any) => {
      console.log('data => ', data);
      return data;
    });
  }

}

// just an interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
