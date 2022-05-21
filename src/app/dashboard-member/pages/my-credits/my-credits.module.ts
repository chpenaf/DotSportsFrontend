import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCreditsComponent } from './my-credits.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';



@NgModule({
  declarations: [
    MyCreditsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class MyCreditsModule { }
