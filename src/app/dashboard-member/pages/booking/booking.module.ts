import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../dashboard/pipes/pipes.module';



@NgModule({
  declarations: [
    BookingComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule
  ]
})
export class BookingModule { }
