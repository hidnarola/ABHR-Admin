import { NgModule } from "@angular/core";
import { RentalsComponent } from './rentals.component'; 
import { CommonModule } from "@angular/common";

@NgModule({
    imports:[
        CommonModule
    ],
    declarations:[
        RentalsComponent
    ],
    exports: [RentalsComponent]
})
export class RentalModule{}