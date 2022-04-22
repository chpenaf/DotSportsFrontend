import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  getCourses( idLocation: number ){

  }

}
