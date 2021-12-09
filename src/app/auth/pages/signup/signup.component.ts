import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { AuthService } from '../../services/auth.service';
import { SignupForm } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = this._fb.group(
    {
      doc_num: [ , [ Validators.required ]],
      first_name: [ , [ Validators.required ]],
      last_name: [ , [ Validators.required ]],
      date_of_birth: [ , [ Validators.required ]],
      sex: [ , [ Validators.required ]],
      email: [ , [ Validators.required ]],
      password: [ , [ Validators.required ]],
      password2: [ , [ Validators.required ]],
    }
  )

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _dateAdapter: DateAdapter<Date>
  ) {
    this._dateAdapter.setLocale('es-CL');
   }

  ngOnInit(): void {
  }

  signup(){

    const { doc_num,
            first_name,
            last_name,
            date_of_birth,
            sex,
            email,
            password,
            password2
          } = this.signupForm.value;

    const form: SignupForm = {
      doc_num,
      first_name,
      last_name,
      date_of_birth:moment(date_of_birth).format('YYYY-MM-DD'),
      sex,
      email,
      password
    };

    console.log(date_of_birth);

    return;

    this._authService.signup(form)
      .subscribe(
        resp => {
          console.log('Creado exitosamente');
          console.log(resp);
        }
      );

  }

}
