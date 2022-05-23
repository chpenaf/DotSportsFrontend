import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guards/auth.guard';
import { DashboardGuard } from './dashboard/guards/dashboard.guard';
import { DashboardMemberGuard } from './dashboard-member/guards/dashboard-member.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule ),
    canLoad: [ DashboardGuard ],
    canActivate: [ DashboardGuard ]
  },
  {
    path: 'dashboard-member',
    loadChildren: () => import('./dashboard-member/dashboard-member.module').then( m => m.DashboardMemberModule ),
    canLoad: [ DashboardMemberGuard ],
    canActivate: [ DashboardMemberGuard ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
