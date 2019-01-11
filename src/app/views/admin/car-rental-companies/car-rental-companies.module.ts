import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
// import { AgmCoreModule } from '@agm/core';
// import { environment } from '../../../../environments/environment';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    // GooglePlaceModule,
    CommonModule,
    DataTablesModule,
    // AgmCoreModule.forRoot({
    //   apiKey: environment.google_api_key,
    //   libraries: ['places']
    // }),
  ],
})
export class CarRentalCompaniesModule { }
