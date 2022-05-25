import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, tap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../interfaces/user.interface';
import { EmployeeService } from './employee.service';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _backend = environment.backend;

  private _current: User = {
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    is_staff: false
  };

  get Current(){
    return {...this._current};
  }

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _employeeService: EmployeeService
  ) { }

  getCurretUser() {

    if( this.Current.id ){
      return of( this.Current );
    }

    const url = `${ this._backend }/users/current/`

    return this._http.get<User>( url, this._authService.getHttpOptions() )
      .pipe(
        tap( resp => {
          this._current = resp;
          if( resp.is_staff ){
            this._employeeService.getLogged().subscribe()
          }
        })
      );
  }

  getStaff(): Observable<boolean>{

    const url = `${ this._backend }/users/current/`

    return this._http.get<User>( url, this._authService.getHttpOptions() )
      .pipe(
        map( resp => {
          return resp.is_staff;
        })
      );

  }

  getMember(): Observable<boolean>{

    const url = `${ this._backend }/users/current/`

    return this._http.get<User>( url, this._authService.getHttpOptions() )
      .pipe(
        map( resp => {
          return !resp.is_staff;
        })
      );

  }

  changePassword(current: string, newpass: string){

    const url = `${ this._backend }/users/current/change-password/`
    const body = {
      current: current,
      newpass: newpass
    }

    return this._http.post<OkResponse>(url, body, this._authService.getHttpOptions());
  }

  clearCurrent(){
    this._current = {
      first_name: '',
      last_name: '',
      full_name: '',
      email: '',
      is_staff: false
    };
  }

}
