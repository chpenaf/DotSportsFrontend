import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../dashboard/services/user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardMemberGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if( this._authService.IsAuthenticated ){

        return this._userService.getMember()
                .pipe(
                  tap(
                    resp => {
                      if( !resp ){
                        this._router.navigate(['./dashboard/home']);
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

        return this._userService.getMember()
                .pipe(
                  tap(
                    resp => {
                      if( !resp ){
                        this._router.navigate(['./dashboard/home']);
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
