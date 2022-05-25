import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardMemberRoutingModule } from './dashboard-member-routing.module';
import { BaseModule } from './pages/base/base.module';
import { BookingModule } from './pages/booking/booking.module';
import { ChangePasswordModule } from './pages/change-password/change-password.module';
import { ComponentsModule } from '../dashboard/components/components.module';
import { CreditsModule } from './pages/credits/credits.module';
import { HomeModule } from './pages/home/home.module';
import { MyBookingsModule } from './pages/my-bookings/my-bookings.module';
import { MyCreditsModule } from './pages/my-credits/my-credits.module';
import { PipesModule } from '../dashboard/pipes/pipes.module';
import { ProfileModule } from './pages/profile/profile.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DashboardMemberRoutingModule,
    BaseModule,
    BookingModule,
    ChangePasswordModule,
    ComponentsModule,
    CreditsModule,
    HomeModule,
    MyBookingsModule,
    MyCreditsModule,
    PipesModule,
    ProfileModule
  ]
})
export class DashboardMemberModule { }
