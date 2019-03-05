import { Component, ElementRef } from '@angular/core';
import { DataSharingService } from '../app/shared/services/data-sharing.service';
import { Keepalive } from '@ng-idle/keepalive';
import { Idle, EventTargetInterruptSource, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public loading;
  idleState = 'NOT_STARTED';
  timeOut = false;
  lastPing?: Date = null;

  title = 'app';
  constructor(
    private dataShare: DataSharingService,
    private keepalive: Keepalive,
    private idle: Idle,
    private element: ElementRef,
    private router: Router,
  ) {
    console.log('in app component => ');
    var user = JSON.parse(localStorage.getItem('admin'));
    var company = JSON.parse(localStorage.getItem('company-admin'));
    this.dataShare.currentloading.subscribe((res) => {
      this.loading = res;
    });
    // sets an idle timeout of 15 min
    idle.setIdle(900);
    // sets a timeout period of 15 mins
    idle.setTimeout(900);
    // sets inturrepts like scroll, keyup-down, mouse wheel, mouse down
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
    });
    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timeOut = true;
      if (user != null && user !== undefined) {
        this.router.navigate(['/admin/login']);
        localStorage.clear();
      } else { }
      if (company != null && company !== undefined) {
        console.log('i am company => ');
        this.router.navigate(['/company/login']);
        localStorage.clear();
      } else { }
    });

    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timeOut = false;
  }


}
