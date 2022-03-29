import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private _router: Router,
    private _authService: AuthService
  ) { }

   canActivate(
     route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if ( this._authService.IsAuthenticated ){
        this._router.navigate(['./dashboard']);
      }

      return !this._authService.IsAuthenticated;

      return this._authService.refresh()
        .pipe(
          tap( isAuthenticated => {
            if ( isAuthenticated ){
              this._router.navigate(['./dashboard']);
              console.log(false)
              return false;
            }
            console.log(true)
            return true;
          } )
        );
   }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean  {

      if ( this._authService.IsAuthenticated ){
        this._router.navigate(['./dashboard']);
      }

      return !this._authService.IsAuthenticated;

      return this._authService.refresh()
        .pipe(
          tap( isAuthenticated => {
            if ( isAuthenticated ){
              this._router.navigate(['./dashboard']);
            }
            return isAuthenticated;
          } )
        );

  }
}
