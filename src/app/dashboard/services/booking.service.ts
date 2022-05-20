import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Booking } from '../interfaces/booking.interface';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  create(booking: Booking) {
    const url = `${ this._backend }/booking/`;
    const body = booking;
    return this._http.post<OkResponse>(url, body, this._auth.getHttpOptions());
  }

  getByMember(idMember:number){
    const url = `${ this._backend }/booking/${ idMember }/`;
    return this._http.get<Booking[]>(url, this._auth.getHttpOptions());
  }

}
