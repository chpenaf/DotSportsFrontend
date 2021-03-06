import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Calendar, CalendarMember, Slot } from '../interfaces/calendar.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  getSlots(idLocation: number, date: Date){

    const oneDate = moment(date,'YYYY-MM-DD');

    const year = oneDate.year();
    const month = oneDate.format('M');
    const day = oneDate.format('D');
    const url = `${ this._backend }/planning/${ idLocation }/calendar/${ year }/${ month }/${ day }/slots/`;
    return this._http.get<Slot[]>(url,this._auth.getHttpOptions());
  }

  getAllSlots(idLocation: number, date: Date){

    const oneDate = moment(date,'YYYY-MM-DD');

    const year = oneDate.year();
    const month = oneDate.format('M');
    const day = oneDate.format('D');
    const url = `${ this._backend }/planning/${ idLocation }/calendar/${ year }/${ month }/${ day }/1/`;
    return this._http.get<Slot[]>(url,this._auth.getHttpOptions());
  }

  getPlanningMonth(idLocation: number, year: number, month: number){
    const url = `${ this._backend }/planning/${ idLocation }/calendar/${ year }/${ month }/`;
    return this._http.get<Calendar[]>(url,this._auth.getHttpOptions());
  }

  getPlanningDay(location: number, pool: number, date: Date){
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const url = `${ this._backend }/planning/${ location }/${ pool }/calendar/${ year }/${ month }/${ day }`;
    return this._http.get<Slot[]>(url, this._auth.getHttpOptions());
  }

  getSlotsMember(idLocation: number){
    const url = `${ this._backend }/planning/${ idLocation }/calendar/slots/`;
    return this._http.get<CalendarMember[]>(url,this._auth.getHttpOptions());
  }

}
