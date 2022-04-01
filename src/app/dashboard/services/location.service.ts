import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Location, LocationResponse, ListLocations } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _backend = environment.backend;
  private _locations: Location[] = [];

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  get locations(): Location[] {
    return this._locations;
  }

  getLocations(){
    const url  = `${ this._backend }/locations/get/`;
    return this._http.get<ListLocations>( url, this._authService.getHttpOptions())
      .pipe(
        tap(
          resp => this._locations = resp.results
        )
      );

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
      formData.append('image',location.image,location.image.name)
    }

    return this._http.post<LocationResponse>( url, formData, this._authService.getHttpOptions())
      .pipe(
        tap( resp => {
          this.locations.push(resp.data);
        })
      );

  }

  updateLocation(location:Location, id:number) {

    const url  = `${ this._backend }/locations/update/${ id }/`;
    const body = location;

    return this._http.put<Location>( url, body, this._authService.getHttpOptions() )
      .pipe(
        tap(resp => {
          const index = this.locations.findIndex( d => d.id === resp.id );
          this.locations.splice(index, 1, resp);
        })
    );

  }

  cancelLocation(location:Location) {

    const url  = `${ this._backend }/locations/cancel/${ location.id }/`;

    return this._http.delete<LocationResponse>( url, this._authService.getHttpOptions() )
      .pipe(
        tap(resp => {
          const index = this.locations.findIndex( d => d.id === location.id );
          this.locations.splice(index, 1);
        })
      );

  }

}
