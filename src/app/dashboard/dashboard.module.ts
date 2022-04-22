import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { ApplicationsModule } from './pages/applications/applications.module';
import { BaseComponent } from './pages/base/base.component';
import { BookingModule } from './pages/booking/booking.module';
import { CalendarModule } from './pages/calendar/calendar.module';
import { CatalogModule } from './pages/catalog/catalog.module';
import { ComponentsModule } from './components/components.module';
import { CoursesModule } from './pages/courses/courses.module';
import { CreateFormComponent } from './pages/locations/create-form/create-form.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { FormComponent } from './pages/employees/form/form.component';
import { FormComponent as FormMemberComponent} from './pages/members/components/form/form.component';
import { HomeComponent } from './pages/home/home.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { ListMembersComponent } from './pages/members/components/list-members/list-members.component';
import { MaterialModule } from '../material/material.module';
import { MembersComponent } from './pages/members/members.component';
import { PoolFormComponent } from './pages/locations/pool-form/pool-form.component';
import { PipesModule } from './pipes/pipes.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ScheduleModule } from './pages/schedule/schedule.module';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    HomeComponent,
    MembersComponent,
    BaseComponent,
    EmployeesComponent,
    LocationsComponent,
    UserComponent,
    ProfileComponent,
    CreateFormComponent,
    FormComponent,
    ListMembersComponent,
    FormMemberComponent,
    PoolFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApplicationsModule,
    ComponentsModule,
    BookingModule,
    CalendarModule,
    CatalogModule,
    CoursesModule,
    ScheduleModule,
    DashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    PipesModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class DashboardModule { }
