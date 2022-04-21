import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseComponent } from './pages/base/base.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { HomeComponent } from './pages/home/home.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { MembersComponent } from './pages/members/members.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CatalogComponent } from './pages/catalog/catalog.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'catalog',
        component: CatalogComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'members',
        component: MembersComponent
      },
      {
        path: 'employees',
        component: EmployeesComponent
      },
      {
        path: 'locations',
        component: LocationsComponent
      },
      {
        path: 'booking',
        component: BookingComponent
      },
      {
        path: 'schedule',
        component: ScheduleComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
