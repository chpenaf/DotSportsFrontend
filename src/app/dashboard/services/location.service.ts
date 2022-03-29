import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Location, LocationResponse, ListLocations } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _backend = environment.backend;

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  getLocations(){
    const url  = `${ this._backend }/locations/get/`;

    return this._http.get<ListLocations>( url, this._authService.getHttpOptions());

  }

  createLocation(location:Location) {

    const url  = `${ this._backend }/locations/create/`;
    const formData = new FormData();

    formData.append('name',location.name)
    formData.append('address',location.address)
    formData.append('id_city',location.id_city)
    formData.append('city',location.city)
    formData.append('id_region',location.id_region)
    formData.append('region',location.region)
    formData.append('phone',location.phone)

    if (location.image){
      console.log('image')
      formData.append('image',location.image,location.image.name)
    }

    return this._http.post<LocationResponse>( url, formData, this._authService.getHttpOptions());

  }
}
