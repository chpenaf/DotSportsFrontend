import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationsComponent } from './pages/applications/applications.component';
import { BaseComponent } from './pages/base/base.component';
import { BookingComponent } from './pages/booking/booking.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { HomeComponent } from './pages/home/home.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { MembersComponent } from './pages/members/members.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ConfigComponent } from './pages/config/config.component';
import { AdminGuard } from './guards/admin.guard';

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
        component: CalendarComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'catalog',
        component: CatalogComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'config',
        component: ConfigComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'members',
        component: MembersComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'locations',
        component: LocationsComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'booking',
        component: BookingComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: 'applications',
        component: ApplicationsComponent,
        canLoad: [ AdminGuard ],
        canActivate: [ AdminGuard ]
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
