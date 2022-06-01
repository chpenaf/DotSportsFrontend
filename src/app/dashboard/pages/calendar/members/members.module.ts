import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../../material/material.module';
import { PipesModule } from '../../../pipes/pipes.module';



@NgModule({
  declarations: [
    MembersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PipesModule
  ]
})
export class MembersModule { }
