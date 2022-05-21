import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { of } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { ListMembers, FormMember, ResponseMember, Member } from '../interfaces/member.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private _backend = environment.backend;
  private _myInfo: Member = {
    id: 0,
    doc_num: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    sex: '',
    status: '',
    user: {
      email: '',
      first_name: '',
      last_name: '',
      full_name: '',
      is_staff: false
    }
  }

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  get auth(){
    return this._authService;
  }

  get myInfo(){
    return {...this._myInfo};
  }

  list(status?:string){
    const url: string = `${ this._backend }/members/list/`;
    let params: HttpParams = new HttpParams();

    if(status){
      params = params.set('status',status);
    }

    return this._http.get<ListMembers[]>(url,this.auth.getHttpOptions(params));
  }

  create( form: FormMember ){

    const url = `${ this._backend }/members/create/`;
    const formData = new FormData();

    const date_of_birth = moment(form.date_of_birth).format('YYYY-MM-DD');

    formData.append('doc_num', form.doc_num);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('date_of_birth', date_of_birth);
    formData.append('sex',form.sex);
    formData.append('status',form.status);
    formData.append('email',form.email);

    if(form.password){
      formData.append('password',form.password);
    }

    if(form.avatar){
      formData.append('avatar',form.avatar,form.avatar.name);
    }

    return this._http.post<ResponseMember>(url,formData,this.auth.getHttpOptions());

  }

  retrieve( id: number ){
    const url = `${ this._backend }/members/get/${ id }/`;

    return this._http.get<Member>(url,this.auth.getHttpOptions());
  }

  update( form: FormMember ){

    const url = `${ this._backend }/members/update/${ form.id }/`;
    const formData = new FormData();
    const date_of_birth = moment(form.date_of_birth).format('YYYY-MM-DD');

    if(form.id){
      formData.append('id', form.id.toString());
    }
    formData.append('doc_num', form.doc_num);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('date_of_birth',date_of_birth);
    formData.append('sex',form.sex);
    formData.append('status',form.status);
    formData.append('email',form.email);

    if(form.password){
      formData.append('password',form.password);
    }

    if(form.avatar){
      formData.append('avatar',form.avatar,form.avatar.name);
    }

    return this._http.put<ResponseMember>(url,formData,this.auth.getHttpOptions());

  }

  cancel( id: number ){

    const url = `${ this._backend }/members/cancel/${ id }/`;

    return this._http.delete<ResponseMember>(url, this.auth.getHttpOptions());
  }

  selfInfo(){

    if(this.myInfo.id){
      return of(this.myInfo);
    }

    const url = `${ this._backend }/members/self/info/`;
    return this._http.get<Member>(url,this.auth.getHttpOptions())
      .pipe(
        tap(
          resp => {
            this._myInfo = resp;
          }
        )
      );
  }

}
