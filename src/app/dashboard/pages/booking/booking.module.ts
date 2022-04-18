import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { BookingComponent } from './booking.component';
import { MaterialModule } from '../../../material/material.module';
import { TimePipe } from '../../pipes/time.pipe';
import { PipesModule } from '../../pipes/pipes.module';

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
  ],
  exports: [
  ]
})
export class BookingModule { }
