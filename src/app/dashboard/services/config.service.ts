import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { CapacityPool } from '../interfaces/config.interface';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  createCapacityPool(capacity: CapacityPool) {
    const url  = `${ this._backend }/config/capacity/pool/`;
    const body = capacity;
    return this._http.post<CapacityPool>(url, body, this._auth.getHttpOptions());
  }

  getCapacityPool() {
    const url  = `${ this._backend }/config/capacity/pool/`;
    return this._http.get<CapacityPool[]>(url, this._auth.getHttpOptions());
  }

  putCapacityPool(capacity: CapacityPool) {
    const url  = `${ this._backend }/config/capacity/pool/${ capacity.id }/`;
    const body = capacity;
    return this._http.put<CapacityPool>(url, body, this._auth.getHttpOptions());
  }

  deleteCapacityPool(id: number) {
    const url  = `${ this._backend }/config/capacity/pool/${ id }/`;
    return this._http.delete<OkResponse>(url, this._auth.getHttpOptions());
  }


}
