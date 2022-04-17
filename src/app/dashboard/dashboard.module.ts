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
import { DialogToConfirmComponent } from './components/dialog-to-confirm/dialog-to-confirm.component';
import { FilenamePipe } from './pipes/filename.pipe';
import { FormComponent } from './pages/employees/form/form.component';
import { FormComponent as FormMemberComponent} from './pages/members/components/form/form.component';
import { ListMembersComponent } from './pages/members/components/list-members/list-members.component';
import { BookingModule } from './pages/booking/booking.module';
import { ScheduleModule } from './pages/schedule/schedule.module';
import { ApplicationsModule } from './pages/applications/applications.module';
import { CalendarModule } from './pages/calendar/calendar.module';
import { PoolFormComponent } from './pages/locations/pool-form/pool-form.component';

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
    CreateFormComponent,
    DialogToConfirmComponent,
    FilenamePipe,
    FormComponent,
    ListMembersComponent,
    FormMemberComponent,
    PoolFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApplicationsModule,
    BookingModule,
    CalendarModule,
    ScheduleModule,
    DashboardRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    AvatarPipe
  ]
})
export class DashboardModule { }
