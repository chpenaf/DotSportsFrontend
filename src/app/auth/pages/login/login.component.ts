import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup = this._fb.group(
    {
      email: [ , [ Validators.required, Validators.email ] ],
      password: [ , [ Validators.required ] ]
    }
  )

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  signin(){

    this.signinForm.markAllAsTouched();

    if(!this.signinForm.valid){
      return;
    }

    const { email, password } = this.signinForm.value;

    this._authService.signin(email,password)
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      )

  }

}
