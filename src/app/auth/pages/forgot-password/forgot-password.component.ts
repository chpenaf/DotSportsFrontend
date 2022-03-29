import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup = this._fb.group(
    {
      email: [ , [ Validators.required, Validators.email ] ]
    }
  )

  get email() {
    return this.forgotForm.controls['email'];
  }

  get emailErrorMsg(): string {

    const errors = this.email.errors;

    if ( errors?.['required'] ) {
      return 'Debe ingresar correo electrónico';
    } else if ( errors?.['email'] ) {
      return 'Correo electrónico no válido';
    }

    return '';
  }

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  recovery(){

    this.forgotForm.markAllAsTouched();

    if(!this.forgotForm.valid){
      return;
    }

    const { email } = this.forgotForm.value;

    this._authService.sendRequestResetPassword( email )
      .subscribe(
        resp => {
          this.openSnackBar();
        }
      )

  }

  openSnackBar() {
    this._snackBar.open('Si el correo existe, se ha enviado instrucciones','Cerrar',{
      duration: 5000,
    });
  }

}
