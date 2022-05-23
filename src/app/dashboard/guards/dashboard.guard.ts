import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if( this._authService.IsAuthenticated ){

        return this._userService.getStaff()
                .pipe(
                  tap(
                    resp => {
                      if( !resp ){
                        this._router.navigate(['./dashboard-member/home']);
                      }
                    }
                  )
                );

      } else {
        this._router.navigate(['auth/login/']);
        return false;
      }

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

      if( this._authService.IsAuthenticated ){

        return this._userService.getStaff()
                .pipe(
                  tap(
                    resp => {
                      if( !resp ){
                        this._router.navigate(['./dashboard-member/home']);
                      }
                    }
                  )
                );

      } else {
        this._router.navigate(['auth/login/']);
        return false;
      }

  }
}
