import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { AuthService } from '../../services/auth.service';
import { SignupForm } from '../../interfaces/auth.interface';
import { FnValidaRut } from '../../../shared/custom-validators';
import { DocnumValidatorService } from '../../../shared/validator/docnum-validator.service';
import { EmailValidatorService } from '../../../shared/validator/email-validator.service';
import { createPasswordStrengthValidator } from '../../../shared/validator/password-strength-validator';
import { ValidatorService } from '../../../shared/validator/validator.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _docnumValidator: DocnumValidatorService,
    private _emailValidator: EmailValidatorService,
    private _validatorService: ValidatorService
  ) { }

  firstStepForm: FormGroup = this._fb.group(
    {
      doc_num: [ , [ Validators.required, FnValidaRut.validaRutControl ], [ this._docnumValidator ] ],
    }
  )

  secondStepForm: FormGroup = this._fb.group(
    {
      first_name: [ , [ Validators.required ]],
      last_name: [ , [ Validators.required ]],
      date_of_birth: [ , [ Validators.required ]],
      sex: [ , [ Validators.required ]],
      email: [ , [ Validators.required, Validators.email ], [ this._emailValidator ] ],
    }
  )

  thirdStepForm: FormGroup = this._fb.group(
    {
      password: [ , [ Validators.required, Validators.minLength(8), createPasswordStrengthValidator() ]],
      password2: [ , [ Validators.required ]],
    }, {
      validators: [ this._validatorService.validate2Passwords('password','password2') ]
    }
  )

  get doc_num() {
    return this.firstStepForm.controls['doc_num'];
  }

  get first_name() {
    return this.secondStepForm.controls['first_name'];
  }

  get last_name() {
    return this.secondStepForm.controls['last_name'];
  }

  get date_of_birth() {
    return this.secondStepForm.controls['date_of_birth'];
  }

  get sex() {
    return this.secondStepForm.controls['sex'];
  }

  get email() {
    return this.secondStepForm.controls['email'];
  }

  get password(){
    return this.thirdStepForm.controls['password'];
  }

  get password2(){
    return this.thirdStepForm.controls['password2'];
  }

  get doc_numErrorMsg(): string {

    const errors = this.doc_num.errors;

    if ( errors?.['required'] ){
      return 'N° Documento es obligatorio.';
    } else if ( errors?.['not_valid'] ){
      return 'N° Documento no válido.';
    } else if ( errors?.['exists'] ){
      return 'N° Documento ya se encuentra registrado.';
    }

    return '';
  }

  get emailErrorMsg(): string {
    const errors = this.email.errors;

    if ( errors?.['required'] ){
      return 'Correo Electrónico es obligatorio.';
    } else if ( errors?.['email'] ){
      return 'Correo Electrónico no válido.';
    } else if ( errors?.['exists'] ){
      return 'Correo Electrónico ya se encuentra registrado.';
    }
    return '';
  }

  get passwordErrorMsg(): string {
    const errors = this.password.errors;

    if ( errors?.['required'] ) {
      return 'Contraseña es oblitagoria';
    } else if ( errors?.['minlength'] ) {
      return 'Contraseña debe tener al menos 8 caracteres'
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

  signup(){

    if ( !this.thirdStepForm.valid ){
      this.thirdStepForm.markAllAsTouched();
      return;
    }

    const { doc_num } = this.firstStepForm.value;

    const { first_name,
            last_name,
            date_of_birth,
            sex,
            email
          } = this.secondStepForm.value;

    const { password,
            password2
          } = this.thirdStepForm.value;

    const form: SignupForm = {
      doc_num,
      first_name,
      last_name,
      date_of_birth:moment(date_of_birth).format('YYYY-MM-DD'),
      sex,
      email,
      password
    };

    this._authService.signup(form)
      .subscribe(
        resp => {
          this._router.navigate(['/auth/login/'])
          this.openSnackBar('Se ha registrado satisfactoriamente');
        }
      );

  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'Cerrar',{
      duration: 5000,
    });
  }

}
