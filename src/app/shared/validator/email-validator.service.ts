import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

  constructor(
    private _authService: AuthService
  ) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    const email = control.value;

    return this._authService.checkEmailExists( email )
      .pipe(
        map( resp => {
          return !resp.code.match('0')
            ? null
            : { exists: true }
        })
      )
  }
}
