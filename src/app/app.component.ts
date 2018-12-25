import { Component } from '@angular/core';
import { DataSharingService } from '../app/shared/services/data-sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public loading;

  title = 'app';
  constructor(
    private dataShare: DataSharingService
  ){
    this.dataShare.currentloading.subscribe((res)=>{
      console.log('datashare in loading', res)
    this.loading = res;
  })}
}
