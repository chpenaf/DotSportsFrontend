import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { createPasswordStrengthValidator } from '../../../shared/validator/password-strength-validator';
import { ValidatorService } from '../../../shared/validator/validator.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  token: string = '';
  uidb64: string = '';

  chgPasswdForm: FormGroup = this._fb.group(
    {
      password:  [ , [ Validators.required, Validators.minLength(8), createPasswordStrengthValidator() ] ],
      password2: [ , [ Validators.required ] ]
    }, {
      validators: [ this._validatorService.validate2Passwords('password','password2') ]
    }
  )

  get password(){
    return this.chgPasswdForm.controls['password'];
  }

  get password2(){
    return this.chgPasswdForm.controls['password2'];
  }

  get passwordErrorMsg(): string {
    const errors = this.password.errors;

    if ( errors?.['required'] ) {
      return 'Contraseña es oblitagoria';
    } else if ( errors?.['passwordStrength'] ) {
      return 'La contraseña debe contener mayúsculas, minúsculas y números';
    }

    return '';

  }

  get password2ErrorMsg(): string {
    const errors = this.password2.errors;

    if ( errors?.['required'] ) {
      return 'Repetir contraseña es oblitagoria';
    } else if ( errors?.['notEquals'] ) {
      return 'Las contraseñas no coinciden';
    }

    return '';

  }

  constructor(
    private _actRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _validatorService: ValidatorService
  ) {
    this._actRoute.queryParams
      .subscribe(params => {
        if( !params['token'] ){
          this._router.navigate(['/auth/login/'])
        }
        this.token = params['token'];
        this.uidb64 = params['uidb64'];
      })
  }

  ngOnInit(): void {

  }

  chgPasswd(){

    this.chgPasswdForm.markAllAsTouched();

    if(!this.chgPasswdForm.valid){
      return;
    }

    const { password } = this.chgPasswdForm.value;


    this._authService.setNewPassword(password, this.token, this.uidb64)
      .subscribe(
        resp => {
          this._router.navigate(['/auth/login/']);
          this.openSnackBar('Contraseña actualizada correctamente');
        },
        error => {
          console.log(error);
          this.openSnackBar('Ha ocurrido un error, intentelo más tarde');
        }
      );

  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'Cerrar',{
      duration: 5000,
    });
  }

}
