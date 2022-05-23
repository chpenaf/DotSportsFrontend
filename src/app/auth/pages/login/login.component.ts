import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar'

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../dashboard/services/user.service';

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

  get email() {
    return this.signinForm.controls['email'];
  }

  get password() {
    return this.signinForm.controls['password'];
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
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _userService: UserService
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
      .subscribe({
        next: resp => {
          this._userService.getCurretUser()
            .subscribe(
              current => {
                if( current.is_staff ){
                  this._router.navigate(['/dashboard/home/']);
                } else {
                  this._router.navigate(['/dashboard-member/home/']);
                }
              }
            )
        },
        error: error => {
          this.openSnackBar();
        }
      });

  }

  enter(event: any){
    if( event.key != 'Enter' ){
      return;
    }
    if( this.signinForm.valid ){
      this.signin();
    }
  }

  openSnackBar() {
    this._snackBar.open('Usuario y/o Contraseña incorrectos','Cerrar',{
      duration: 5000,
    });
  }

}
