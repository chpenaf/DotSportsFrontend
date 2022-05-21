import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardMemberRoutingModule } from './dashboard-member-routing.module';
import { BaseModule } from './pages/base/base.module';
import { BookingModule } from './pages/booking/booking.module';
import { CreditsModule } from './pages/credits/credits.module';
import { HomeModule } from './pages/home/home.module';
import { PipesModule } from '../dashboard/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DashboardMemberRoutingModule,
    BaseModule,
    BookingModule,
    CreditsModule,
    HomeModule,
    PipesModule
  ]
})
export class DashboardMemberModule { }
