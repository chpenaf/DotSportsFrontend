import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Token, SignupForm, Refresh } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _backend = environment.backend;
  private _token: Token ={
    refresh: '',
    access: ''
  };

  get Token(){
    return this._token;
  }

  constructor(
    private _http: HttpClient
  ) { }

  signin( email: string, password: string ){
    const url = `${ this._backend }/auth/token/`;
    const body = { email, password };

    return this._http.post<Token>(url,body)
      .pipe(
        tap( resp => this._token = resp ),
        tap( resp => {
          localStorage.setItem('refresh',resp.refresh);
          localStorage.setItem('access',resp.access);
        })
      );
  }

  refresh(){
    const url = `${ this._backend }/auth/token/refresh/`;
    const body = localStorage.getItem('refresh');

    return this._http.post<Refresh>(url, body)
      .pipe(
        tap( resp => this.Token.access = resp.access ),
        tap( resp => localStorage.setItem('access',resp.access))
      )
  }

  signup( form: SignupForm ){
    const url = `${ this._backend }/members/signup/`;
    const body = form;

    return this._http.post<SignupForm>(url, body);
  }

}
