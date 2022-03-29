import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private _baseUrl = environment.backend;

  constructor() { }

  async updateImage(
    file: File,
    tipo: 'user'|'location'|'member'|'employee',
    id: string
  ) {

    const url = `${ this._baseUrl }`

    try {

      return true;

    } catch(error) {
      console.log(error);
      return false;
    }

  }

}
