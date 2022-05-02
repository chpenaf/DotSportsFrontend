import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotsComponent } from './slots.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';



@NgModule({
  declarations: [
    SlotsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SlotsModule { }
