import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { CreditHeader } from '../interfaces/credits.interface';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  getCredits( id: number ){
    const url = `${ this._backend }/credits/credit/${ id }/`;
    return this._http.get<CreditHeader[]>(url,this._auth.getHttpOptions() );
  }

  getQuantCredits( id: number ) {
    const url = `${ this._backend }/credits/credit/${ id }/quant/`;
    return this._http.get<any>(url,this._auth.getHttpOptions() );
  }

  saveCredit( credit: CreditHeader ){
    const url = `${ this._backend }/credits/credit/`;
    return this._http.post<any>(url, credit, this._auth.getHttpOptions());
  }

}
