import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ChoiceField, OkResponse } from '../../shared/interfaces/shared.interface';
import { AuthService } from '../../auth/services/auth.service';
import { Schedule, ScheduleResponse, DayType, Slot } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private _backend = environment.backend;
  private _daytypes: ChoiceField[] = [];

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  get DayTypes(){
    return [...this._daytypes]
  }

  getDayTypes(){

    if( this.DayTypes.length > 0 ){
      return of(this.DayTypes);
    }

    const url = `${ this._backend }/schedules/get/daytypes/`;

    return this._http.get<ChoiceField[]>(url)
      .pipe(
        tap( resp => this._daytypes = resp )
      );
  }

  getSchedule( id: number ){
    const url = `${ this._backend }/schedules/get/${ id }/`;

    return this._http.get<Schedule>(url, this._authService.getHttpOptions());
  }

  getSchedules( id_location: number ){
    const url = `${ this._backend }/schedules/get/location/${ id_location }/`;

    return this._http.get<Schedule[]>(url, this._authService.getHttpOptions());
  }

  save(body: Schedule) {
    const url = `${ this._backend }/schedules/save/`;
    console.log(body);
    return this._http.post<ScheduleResponse>(url,body,this._authService.getHttpOptions());

  }

  update(body: Schedule) {
    const baseUrl = `${ this._backend }/schedules/save/`;
    const url = `${ baseUrl }${ body.id }/`;
    return this._http.put<ScheduleResponse>(url,body,this._authService.getHttpOptions());
  }

  saveDay(days: DayType[]){
    const url = `${ this._backend }/schedules/day/`;
    return this._http.post<DayType[]>(url, days, this._authService.getHttpOptions());
  }

  saveSlots(slots: Slot[]){
    const url = `${ this._backend }/schedules/day/slots/`;
    return this._http.post<Slot[]>(url,slots, this._authService.getHttpOptions());
  }

  getWeekSchedule(idLocation:number){
    const url = `${ this._backend }/schedules/day/${ idLocation }/`;
    return this._http.get<DayType[]>(url, this._authService.getHttpOptions());
  }

}
