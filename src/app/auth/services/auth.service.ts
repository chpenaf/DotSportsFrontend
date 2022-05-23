import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Token, SignupForm, Refresh, Response, SetNewPasswordResponse, Response2 } from '../interfaces/auth.interface';
import { ApplicationsService } from '../../dashboard/services/applications.service';

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

  get IsAuthenticated(): boolean {
    if ( localStorage.getItem('access') ) {
      return true;
    }
    return false;
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

  refresh(): Observable<boolean> {

    if ( !localStorage.getItem('access') ) {
      return of(false);
    }

    const url = `${ this._backend }/auth/token/refresh/`;
    const body = { refresh: localStorage.getItem('refresh') };

    return this._http.post<Refresh>(url, body)
      .pipe(
        map( resp => {
          this.Token.access = resp.access;
          localStorage.setItem('access',resp.access);
          return true;
        } )
      );

  }

  checkDocnumExists( doc_num: string ){
    const url = `${ this._backend }/auth/check-docnum-exists/`;
    const body = { doc_num }

    return this._http.post<Response2>(url,body);
  }

  checkEmailExists( email: string ){
    const url = `${ this._backend }/auth/check-email-exists/`;
    const body = { email }

    return this._http.post<Response2>(url,body);
  }

  signup( form: SignupForm ){
    const url = `${ this._backend }/members/signup/`;
    const body = form;

    return this._http.post<SignupForm>(url, body);
  }

  signout(){
    this._token = {
      access: '',
      refresh: ''
    };
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  sendRequestResetPassword( email: string ){
    const url = `${ this._backend }/auth/request-reset-email/`;
    const body = { email };

    return this._http.post<Response>(url,body);
  }

  setNewPassword( password: string, token: string, uidb64: string ){
    const url = `${ this._backend }/auth/password-reset-complete/`;
    const body = { password, token, uidb64 }
    return this._http.patch<SetNewPasswordResponse>(url,body);

  }



  getAuthorization(){
    const access = localStorage.getItem('access') || '';
    const token = `Bearer ${ access }`;
    return token;
  }

  getHttpOptions(params?:HttpParams){
    return {
      headers: new HttpHeaders({
        Authorization: this.getAuthorization()
      }),
      params: params
    };
  }

}
