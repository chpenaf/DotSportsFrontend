import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../../material/material.module';
import { CalendarComponent } from './calendar.component';
import { SlotsModule } from './slots/slots.module';
import { MembersModule } from './members/members.module';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    SlotsModule,
    MembersModule
  ]
})
export class CalendarModule { }
