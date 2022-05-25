import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { createPasswordStrengthValidator } from '../../../shared/validator/password-strength-validator';
import { DialogsService } from '../../../dashboard/components/dialogs.service';
import { UserService } from '../../../dashboard/services/user.service';
import { ValidatorService } from '../../../shared/validator/validator.service';

@Component({
  selector: 'app-change-password-member',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _dialogService: DialogsService,
    private _userService: UserService,
    private _validatorService: ValidatorService
  ) { }

  passwordForm = this._fb.group({
    current: [ , [ Validators.required ] ],
    newpass: [ , [ Validators.required, Validators.minLength(8), createPasswordStrengthValidator() ] ],
    repeat: [ , [ Validators.required ] ]
  }, {
    validators: [ this._validatorService.validate2Passwords('newpass','repeat') ]
  });

  get current(){
    return this.passwordForm.controls['current'];
  }

  get newpass(){
    return this.passwordForm.controls['newpass'];
  }

  get repeat(){
    return this.passwordForm.controls['repeat']
  }

  get passwordErrorMsg(): string {
    const errors = this.newpass.errors;

    if ( errors?.['required'] ) {
      return 'Contraseña es oblitagoria';
    } else if ( errors?.['passwordStrength'] ) {
      return 'La contraseña debe contener mayúsculas, minúsculas y números';
    }

    return '';

  }

  get password2ErrorMsg(): string {
    const errors = this.repeat.errors;

    if ( errors?.['required'] ) {
      return 'Repetir contraseña es oblitagoria';
    } else if ( errors?.['notEquals'] ) {
      return 'Las contraseñas no coinciden';
    }

    return '';

  }

  ngOnInit(): void {
    this._userService.getCurretUser()
      .subscribe(
        resp => { }
      )
  }

  back(){
    this._location.back();
  }

  change(){

    if( this.passwordForm.invalid ){
      this.passwordForm.markAllAsTouched();
      return;
    }

    this._userService.changePassword(this.current.value, this.newpass.value)
      .subscribe({
        next: response => this._dialogService.openSnackBar(response.message,'Cerrar'),
        error: err => this._dialogService.openSnackBar(err.error.message,'Cerrar')
      })

  }

}
