import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotsComponent } from './slots.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { PipesModule } from '../../../../dashboard/pipes/pipes.module';



@NgModule({
  declarations: [
    SlotsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule
  ]
})
export class SlotsModule { }
