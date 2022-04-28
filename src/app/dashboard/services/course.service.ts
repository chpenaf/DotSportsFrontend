import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Course, Schedule } from '../interfaces/courses.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

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

  saveSchedule(schedule: Schedule[]){
    const url = `${ this._backend }/courses/schedule/`;
    return this._http.post<Schedule[]>(url,schedule,this._auth.getHttpOptions());
  }

}
