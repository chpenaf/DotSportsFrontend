import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Catalog, Course, CourseAdd, Level, LevelUpd } from '../interfaces/catalog.interface';
import { OkResponse } from '../../shared/interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private _backend = environment.backend;
  private _catalog: Catalog = {};

  constructor(
    private _http: HttpClient,
    private _auth: AuthService
  ) { }

  get catalog() {
    return this._catalog;
  }

  getCatalog( idLocation: number ){
    const url = `${ this._backend }/catalog/${ idLocation }/`;
    return this._http.get<Catalog>( url, this._auth.getHttpOptions() )
      .pipe(
        tap( resp => this._catalog = resp )
      );
  }

  deleteSubcategory( level: Level ){
    const url = `${ this._backend }/catalog/subcategory/${ level.id }/`;
    return this._http.delete<OkResponse>( url, this._auth.getHttpOptions() );
  }


  createCourse( course: CourseAdd, idLocation: number ){
    const url = `${ this._backend }/catalog/courses/${ idLocation }/`;
    const body = course;
    return this._http.post<Course>( url, body, this._auth.getHttpOptions() );
  }

  updateCourse( course: CourseAdd ){
    const url = `${ this._backend }/catalog/courses/`;
    const body = course;
    return this._http.put<Course>( url, body, this._auth.getHttpOptions() );
  }

  deleteCourse( idCourse: number ){
    const url = `${ this._backend }/catalog/courses/id/${ idCourse }/`;
    return this._http.delete<OkResponse>( url, this._auth.getHttpOptions() );
  }

  updateCourseLevels( levels: Level[] ){
    const url = `${ this._backend }/catalog/courses/levels/`;
    const body = levels;
    return this._http.post<LevelUpd[]>( url, body, this._auth.getHttpOptions() );
  }

  deleteCourseLevel( id: number ){
    const url = `${ this._backend }/catalog/courses/levels/${ id }/`;
    return this._http.delete<OkResponse>( url, this._auth.getHttpOptions() );
  }

}
