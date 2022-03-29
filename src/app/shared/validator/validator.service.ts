import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidatorService  {

  validate2Passwords( passwd1: string, passwd2: string ) {

    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const p1 = formGroup.get(passwd1)?.value;
      const p2 = formGroup.get(passwd2)?.value;

      if ( p1 !== p2 ){
        formGroup.get(passwd2)?.setErrors({ notEquals: true });
        return { notEquals: true }
      }

      formGroup.get(passwd2)?.setErrors(null);
      return null;
    }

  }

}
