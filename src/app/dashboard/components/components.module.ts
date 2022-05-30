import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from './credits/credits.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { PipesModule } from '../pipes/pipes.module';
import { DialogToConfirmComponent } from './dialog-to-confirm/dialog-to-confirm.component';
import { DialogsService } from './dialogs.service';
import { BookingsComponent } from './bookings/bookings.component';
import { DialogFormComponent } from './dialog-form/dialog-form.component';


@NgModule({
  declarations: [
    CreditsComponent,
    DialogToConfirmComponent,
    BookingsComponent,
    DialogFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule
  ],
  exports: [
    CreditsComponent,
    DialogToConfirmComponent,
    DialogFormComponent
  ],
  providers: [
    DialogsService
  ]
})
export class ComponentsModule { }
