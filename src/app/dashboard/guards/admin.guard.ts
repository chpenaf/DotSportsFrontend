import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { EmployeeService } from '../services/employee.service';
import { tap } from 'rxjs/operators';
import { ApplicationsService } from '../services/applications.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router,
    private _appService: ApplicationsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(route.routeConfig?.path){
        return this._appService.canExecute(route.routeConfig?.path)
                .pipe(
                  tap(
                    resp => {
                      if( !resp ) {
                        this._router.navigate(['/dashboard/home']);
                      }
                    }
                  )
                )
      } else{
        this._router.navigate(['/dashboard/home']);
        return false;
      }

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

      return true;
  }

}
