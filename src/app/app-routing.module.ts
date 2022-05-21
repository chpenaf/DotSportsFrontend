import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule )
  },
  {
    path: 'dashboard-member',
    loadChildren: () => import('./dashboard-member/dashboard-member.module').then( m => m.DashboardMemberModule )
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
