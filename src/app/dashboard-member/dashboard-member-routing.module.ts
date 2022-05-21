import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseComponent } from './pages/base/base.component';
import { BookingComponent } from './pages/booking/booking.component';
import { HomeComponent } from './pages/home/home.component';

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
        path: 'booking',
        component: BookingComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardMemberRoutingModule { }
