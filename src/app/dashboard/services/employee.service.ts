import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { Employee, CreateEmployee, ListEmployee, EmployeeResponse, EditEmployee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private _backend = environment.backend;
  private _employees: ListEmployee[] = [];
  private _myInfo: Employee = {
    doc_num: '',
    first_name: '',
    last_name: '',
    date_of_birth: null,
    sex: '',
    job: '',
    hire_date: null,
    user: {
      email: '',
      first_name: '',
      last_name: '',
      full_name: '',
      is_staff: false
    },
    is_active: false
  };

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) {
  }

  get myInfo(){
    return {...this._myInfo};
  }

  get employees(): ListEmployee[] {
    return this._employees;
  }

  listEmployees() {
    const url = `${ this._backend }/employees/list/`;

    return this._http.get<ListEmployee[]>(url,this._authService.getHttpOptions())
      .pipe(
        tap( resp => {this._employees = resp} )
      )
  }

  createEmployee( form: CreateEmployee ) {
    const url = `${ this._backend }/employees/create/`;
    const formData = new FormData();

    formData.append('doc_num', form.doc_num);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('date_of_birth', form.date_of_birth);
    formData.append('sex',form.sex);
    formData.append('job',form.job);
    formData.append('hire_date',form.hire_date);
    formData.append('id_location',form.id_location.toString());
    formData.append('is_active', form.is_active );
    formData.append('email',form.email);
    formData.append('password',form.password);

    if(form.avatar){
      formData.append('avatar',form.avatar,form.avatar.name);
    }

    return this._http.post<Employee>(url,formData, this._authService.getHttpOptions())

  }

  get(id: number){
    const url = `${ this._backend }/employees/get/${ id }/`;
    return this._http.get<Employee>( url, this._authService.getHttpOptions());
  }

  getLogged(){

    if(this.myInfo.id){
      return of(this.myInfo);
    }

    const url = `${ this._backend }/employees/get/logged/`;
    return this._http.get<Employee>( url, this._authService.getHttpOptions())
      .pipe(
        tap( resp => {
          this._myInfo = resp;
        } )
      );
  }

  update( form: EditEmployee ){
    const url = `${ this._backend }/employees/update/${ form.id }/`;
    const formData = new FormData();
    const id: string = form.id.toString();
    formData.append('id', id);
    formData.append('doc_num', form.doc_num);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('date_of_birth', form.date_of_birth);
    formData.append('sex',form.sex);
    formData.append('job',form.job);
    formData.append('hire_date',form.hire_date);
    formData.append('id_location',form.id_location.toString());
    formData.append('is_active', form.is_active );
    formData.append('email',form.email);

    if(form.avatar){
      formData.append('avatar',form.avatar,form.avatar.name);
    }

    return this._http.put<Employee>(url,formData, this._authService.getHttpOptions())
  }

  cancel(id: number){
    const url = `${ this._backend }/employees/cancel/${ id }/`;

    return this._http.delete<EmployeeResponse>( url, this._authService.getHttpOptions());
  }

  getAdmin(): Observable<boolean> {

    if( this.myInfo.id ) {
      if( this.myInfo.job === 'AD' ){
        return of(true);
      } else {
        return of(false);
      }
    }

    const url = `${ this._backend }/employees/get/logged/`;
    return this._http.get<Employee>( url, this._authService.getHttpOptions())
      .pipe(
        map( resp => {
          if( resp.job === 'AD' ){
            return true;
          } else {
            return false;
          }
        })
      );

  }

  clearMyInfo(){
    this._myInfo = {
      doc_num: '',
      first_name: '',
      last_name: '',
      date_of_birth: null,
      sex: '',
      job: '',
      hire_date: null,
      user: {
        email: '',
        first_name: '',
        last_name: '',
        full_name: '',
        is_staff: false
      },
      is_active: false
    };
  }

}
