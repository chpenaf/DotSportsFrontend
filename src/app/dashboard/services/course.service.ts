import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Course, Schedule, CourseSession } from '../interfaces/courses.interface';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  get httpOptions(){
    return this._auth.getHttpOptions();
  }

  getCourses(idLocation: number){
    const url = `${ this._backend }/courses/location/${ idLocation }/`;
    return this._http.get<Course[]>(url,this._auth.getHttpOptions());
  }

  saveCourse(course: Course){
    const url = `${ this._backend }/courses/`;
    return this._http.post<Course>(url,course,this._auth.getHttpOptions());
  }

  updateCourse(id: number, course: Course){
    const url = `${ this._backend }/courses/${ id }/`;
    return this._http.put<Course>(url,course,this._auth.getHttpOptions());
  }

  deleteCourse(id: number){
    const url = `${ this._backend }/courses/${ id }/`;
    return this._http.delete<OkResponse>(url, this._auth.getHttpOptions());
  }

  saveSchedule(schedule: Schedule[]){
    const url = `${ this._backend }/courses/schedule/`;
    return this._http.post<Schedule[]>(url,schedule,this._auth.getHttpOptions());
  }

  getSessions(date: Date){
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const url = `${ this._backend }/courses/session/${ year }/${ month }/${ day }`;
    return this._http.get<CourseSession[]>(url, this.httpOptions);
  }

}
