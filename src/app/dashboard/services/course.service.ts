import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Course } from '../interfaces/courses.interface';

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

}
