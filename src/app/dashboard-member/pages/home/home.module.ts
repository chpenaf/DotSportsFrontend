import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material/material.module';
import { PipesModule } from '../../../dashboard/pipes/pipes.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    PipesModule
  ]
})
export class HomeModule { }
