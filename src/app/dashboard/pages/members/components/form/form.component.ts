import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MY_DATE_FORMATS } from '../../../../../app.component';
import { createPasswordStrengthValidator } from '../../../../../shared/validator/password-strength-validator';
import { FnValidaRut } from '../../../../../shared/custom-validators';
import { DocnumValidatorService } from '../../../../../shared/validator/docnum-validator.service';
import { ValidatorService } from '../../../../../shared/validator/validator.service';
import { EmailValidatorService } from '../../../../../shared/validator/email-validator.service';
import { DialogMember, FormMember } from '../../../../interfaces/member.interface';
import { MembersService } from '../../../../services/members.service';
import { MembersComponent } from '../../members.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class FormComponent implements OnInit {

  @ViewChild("fileInput", {static:false}) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("image", {static:false}) image!: ElementRef<HTMLImageElement>;

  file!: File;
  imgTmp: any = '';
  imgName: string = '';

  constructor(
    private _fb: FormBuilder,
    private _docnumValidator: DocnumValidatorService,
    private _emailValidator: EmailValidatorService,
    private _memberService: MembersService,
    private _validatorService: ValidatorService,
    public dialogRef: MatDialogRef<MembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMember
  ) {
    if( data.update ){
      this.doc_num.clearValidators();
      this.doc_num.clearAsyncValidators();
      this.password.clearValidators();
      this.password.clearAsyncValidators();
      this.password2.clearValidators();
      this.doc_num.disable();
      this.password.disable();
      this.password2.disable();
      this.email.clearValidators();
      this.email.clearAsyncValidators();
    }
  }

  ngOnInit(): void {
  }

  get member(){
    return this.data.member;
  }

  memberForm: FormGroup = this._fb.group(
    {
      doc_num: [ this.member?.doc_num, [ Validators.required, FnValidaRut.validaRutControl ], [ this._docnumValidator ] ],
      first_name: [ this.member?.first_name, [ Validators.required ] ],
      last_name: [ this.member?.last_name, [ Validators.required ] ],
      date_of_birth: [ this.member?.date_of_birth, [ Validators.required ] ],
      sex: [ this.member?.sex, [ Validators.required ] ],
      status: [ this.member?.status, [ Validators.required ] ],
      image: [ , [ ] ],
      email: [ this.member?.user.email, [ Validators.required, Validators.email ], [ this._emailValidator ] ],
      password: [ , [ Validators.required, Validators.minLength(8), createPasswordStrengthValidator() ]],
      password2: [ , [ Validators.required ]],
    }, {
      validators: [ this._validatorService.validate2Passwords('password','password2') ]
    }
  );

  get doc_num() {
    return this.memberForm.controls['doc_num'];
  }

  get first_name() {
    return this.memberForm.controls['first_name'];
  }

  get last_name() {
    return this.memberForm.controls['last_name'];
  }

  get date_of_birth() {
    return this.memberForm.controls['date_of_birth'];
  }

  get sex() {
    return this.memberForm.controls['sex'];
  }

  get status() {
    return this.memberForm.controls['status'];
  }

  get email() {
    return this.memberForm.controls['email'];
  }

  get password() {
    return this.memberForm.controls['password'];
  }

  get password2() {
    return this.memberForm.controls['password2'];
  }

  /**
   * Mensajes de error
   */

  get docNumErrorMsg() {

    const errors = this.doc_num.errors;

    if ( errors?.['required'] ) {
      return 'N° Documento es obligatorio.';
    } else if ( errors?.['not_valid'] ) {
      return 'N° Documento no válido.';
    } else if ( errors?.['exists'] ) {
      return 'N° Documento ya se encuentra registrado.';
    }

    return '';

  }

  get emailErrorMsg() {

    const errors = this.email.errors;

    if ( errors?.['required'] ) {
      return 'Correo Electrónico es obligatorio';
    } else if ( errors?.['email'] ) {
      return 'Correo Electrónico inválido';
    } else if ( errors?.['exists'] ){
      return 'Correo Electrónico ya se encuentra registrado.';
    }

    return '';
  }

  get passwordErrorMsg(){

    const errors = this.password.errors;

    if ( errors?.['required'] ) {
      return 'Contraseña es obligatoria';
    } else if ( errors?.['minlength'] ) {
      return 'Contraseña debe tener al menos 8 caracteres'
    } else if ( errors?.['passwordStrength'] ) {
      return 'La contraseña debe contener mayúsculas, minúsculas y números';
    }

    return '';
  }

  get password2ErrorMsg(){
    const errors = this.password2.errors;

    if ( errors?.['required'] ) {
      return 'Repetir contraseña es oblitagoria';
    } else if ( errors?.['notEquals'] ) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  submit() {

    if( this.memberForm.invalid ){
      this.memberForm.markAllAsTouched();
      return;
    }

    if( this.data.create ){

      const newMember: FormMember = {
        doc_num: this.doc_num.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        date_of_birth: this.date_of_birth.value,
        sex: this.sex.value,
        status: this.status.value,
        email: this.email.value,
        avatar: this.file,
        password: this.password.value
      }

      this._memberService.create(newMember).subscribe();

    }

    if( this.data.update ){

      const editMember: FormMember = {
        id: this.data.member?.id,
        doc_num: this.doc_num.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        date_of_birth: this.date_of_birth.value,
        sex: this.sex.value,
        status: this.status.value,
        avatar: this.file,
        email: this.email.value,
      }

      this._memberService.update(editMember).subscribe();

    }

  }

  browseImage() {
    const fileInput = this.fileInput.nativeElement;

    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      const filename: string = file?.name || '';
      this.memberForm.controls['image'].setValue(filename);
      this.imgName = filename;
    }

    fileInput.click();

  }

  onFileChange(event:any){
    const file: File = event.target?.files?.[0];
    const reader = new FileReader();

    if (!file){
      this.imgTmp = null;
      return;
    }

    this.file = file;

    reader.readAsDataURL( this.file );
    reader.onloadend = () => {
      this.imgTmp = reader.result;
    }
  }

}
