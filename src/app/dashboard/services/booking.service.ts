import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Booking } from '../interfaces/booking.interface';
import { OkResponse } from '../../shared/interfaces/shared.interface';
import { Member } from '../interfaces/member.interface';

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

  getById(id: number){
    const url = `${ this._backend }/booking/${ id }/`;
    return this._http.get<Booking[]>(url, this._auth.getHttpOptions());
  }

  getByMember(idMember:number){
    const url = `${ this._backend }/booking/member/${ idMember }/`;
    return this._http.get<Booking[]>(url, this._auth.getHttpOptions());
  }

  delete(id: number){
    const url = `${ this._backend }/booking/${ id }/`;
    return this._http.delete<OkResponse>(url, this._auth.getHttpOptions());
  }

  getNextBook(){
    const url = `${ this._backend }/booking/member/next/`;
    return this._http.get<Booking>(url, this._auth.getHttpOptions());
  }

  getBySlot(id: number){
    const url = `${ this._backend }/booking/slot/${ id }/`;
    return this._http.get<Member[]>(url, this._auth.getHttpOptions());
  }

}
