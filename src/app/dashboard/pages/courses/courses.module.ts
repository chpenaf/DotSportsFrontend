import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { CoursesComponent } from './courses.component';
import { MaterialModule } from '../../../material/material.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ScheduleModule } from './schedule/schedule.module';



@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    ScheduleModule
  ]
})
export class CoursesModule { }
