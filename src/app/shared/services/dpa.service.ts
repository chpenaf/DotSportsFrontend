import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Region } from '../interfaces/dpa.interface';


@Injectable({
  providedIn: 'root'
})
export class DpaService {

  constructor(
    private _http: HttpClient
  ) { }

  get baseUrl(): string {
    return 'https://apis.digital.gob.cl/dpa'
  }

  getRegions(){
    const url: string = `${ this.baseUrl }/regiones/`;
    return this._http.get<Region[]>( url );
  }

  getComunas( codRegion: string ){
    const url: string = `${ this.baseUrl }/regiones/${ codRegion }/comunas`;
    return this._http.get<Region[]>( url );
  }

}
