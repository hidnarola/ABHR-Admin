import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
  selector: 'app-returned-tracking',
  templateUrl: './returned-tracking.component.html',
  styleUrls: ['./returned-tracking.component.css']
})
export class ReturnedTrackingComponent implements OnInit, AfterViewInit, OnDestroy {

  x = 0.000010;
  msg: any;
  bookingId: any;
  userId: any;
  public trackData;

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
    private router: Router,
    private route: ActivatedRoute,
    public service: CrudService,
  ) { }

  markers: Marker[] = [];
  clickedMarker(label: string, index: number) { }

  mapClicked($event: MouseEvent) { }

  markerDragEnd(m: Marker, $event: MouseEvent) { }

  ngOnDestroy() { }

  ngOnInit() {
    const user: any = JSON.parse(localStorage.getItem('admin'));
    this.userId = user._id;
    this.route.params.subscribe(param => {
      this.bookingId = param.id;
    });
    this.getDirection();
  }
  ngAfterViewInit(): void { }

  getDirection() {
    this.service.post('admin/tracking/returned/details', { 'booking_id': this.bookingId }).subscribe(res => {
      this.trackData = res['result'];
      this.origin = {
        lat: this.trackData.return_source_location[1],
        lng: this.trackData.return_source_location[0]
      };
      this.destination = {
        lat: this.trackData.latitude,
        lng: this.trackData.longitude
      };
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
