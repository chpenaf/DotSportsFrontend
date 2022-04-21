import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { App } from '../interfaces/application.interface';
import { AuthService } from '../../auth/services/auth.service';
import { tap } from 'rxjs/operators';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private _backend = environment.backend;

  private _apps: App[] = [];

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
  ) { }

  get Apps(){
    return [...this._apps]
  }


  getApps(db?:boolean){

    if( !db ){
      if( this.Apps.length > 0 ){
        return of(this.Apps);
      }
    }

    const url = `${ this._backend }/main/apps/`;
    return this._http.get<App[]>(url,this._authService.getHttpOptions() )
      .pipe(
        tap( resp => this._apps = resp )
      )
  }

  saveApps(apps: App[]){

    const url = `${ this._backend }/main/apps/update/`;

    return this._http.put<OkResponse>(url, apps, this._authService.getHttpOptions());

  }

  delete(id: number){
    const url = `${ this._backend }/main/apps/delete/${ id }/`;

    return this._http.delete<OkResponse>(url, this._authService.getHttpOptions());

  }

}
