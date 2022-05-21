import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BaseComponent } from './base.component';
import { MaterialModule } from '../../../material/material.module';
import { PipesModule } from '../../../dashboard/pipes/pipes.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BaseComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PipesModule
  ]
})
export class BaseModule { }
