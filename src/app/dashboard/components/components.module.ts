import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from './credits/credits.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  declarations: [
    CreditsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule
  ],
  exports: [
    CreditsComponent
  ]
})
export class ComponentsModule { }
