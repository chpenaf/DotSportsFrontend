import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../interfaces/user.interface';
import { tap } from 'rxjs';
import { EmployeeService } from './employee.service';

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
    return this._current;
  }

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _employeeService: EmployeeService
  ) { }

  getCurretUser() {

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

}
