import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MembersComponent } from './pages/members/members.component';
import { BaseComponent } from './pages/base/base.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { MaterialModule } from '../material/material.module';
import { UserComponent } from './pages/user/user.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AvatarPipe } from './pipes/avatar.pipe';
import { CreateFormComponent } from './pages/locations/create-form/create-form.component';


@NgModule({
  declarations: [
    HomeComponent,
    MembersComponent,
    BaseComponent,
    EmployeesComponent,
    LocationsComponent,
    UserComponent,
    ProfileComponent,
    AvatarPipe,
    CreateFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class DashboardModule { }
