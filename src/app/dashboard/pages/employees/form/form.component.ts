import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import * as moment from 'moment';

import { MY_DATE_FORMATS } from '../../../../app.component';
import { EmailValidatorService } from '../../../../shared/validator/email-validator.service';
import { FnValidaRut } from '../../../../shared/custom-validators';
import { ValidatorService } from '../../../../shared/validator/validator.service';
import { DocnumValidatorService } from '../../../../shared/validator/docnum-validator.service';
import { EmployeesComponent } from '../employees.component';
import { EmployeeForm, CreateEmployee, EditEmployee } from '../../../interfaces/employee.interface';
import { createPasswordStrengthValidator } from '../../../../shared/validator/password-strength-validator';
import { LocationSelect } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location.service';
import { EmployeeService } from '../../../services/employee.service';

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

  listLocations: LocationSelect[] = [];

  constructor(
    private _fb: FormBuilder,
    private _docnumValidator: DocnumValidatorService,
    private _emailValidator: EmailValidatorService,
    private _employeeService: EmployeeService,
    private _locationService: LocationService,
    private _validatorService: ValidatorService,
    public dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeForm
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

      this.email.clearAsyncValidators();
    }
   }

  get employee(){
    return this.data.employee;
  }

  employeeForm: FormGroup = this._fb.group(
    {
      doc_num: [ this.employee?.doc_num, [ Validators.required, FnValidaRut.validaRutControl ], [ this._docnumValidator ] ],
      first_name: [ this.employee?.first_name, [ Validators.required ] ],
      last_name: [ this.employee?.last_name, [ Validators.required ] ],
      date_of_birth: [ this.employee?.date_of_birth, [ Validators.required ] ],
      sex: [ this.employee?.sex, [ Validators.required ] ],
      image: [ , [ ] ],
      job: [ this.employee?.job, [ Validators.required ] ],
      hire_date: [ this.employee?.hire_date, [ Validators.required ] ],
      location: [ this.employee?.location?.id, [ Validators.required ] ],
      email: [ this.employee?.user.email, [ Validators.required, Validators.email ], [ this._emailValidator ] ],
      password: [ , [ Validators.required, Validators.minLength(8), createPasswordStrengthValidator() ]],
      password2: [ , [ Validators.required ]],
    }, {
      validators: [ this._validatorService.validate2Passwords('password','password2') ]
    }
  );

  ngOnInit(): void {
    this._locationService.getLocationToSelect()
      .subscribe(
        resp => this.listLocations = resp
      );
  }

  get doc_num() {
    return this.employeeForm.controls['doc_num'];
  }

  get first_name() {
    return this.employeeForm.controls['first_name'];
  }

  get last_name() {
    return this.employeeForm.controls['last_name'];
  }

  get date_of_birth() {
    return this.employeeForm.controls['date_of_birth'];
  }

  get sex() {
    return this.employeeForm.controls['sex'];
  }

  get job() {
    return this.employeeForm.controls['job'];
  }

  get hire_date() {
    return this.employeeForm.controls['hire_date'];
  }

  get location() {
    return this.employeeForm.controls['location'];
  }

  get email() {
    return this.employeeForm.controls['email'];
  }

  get password() {
    return this.employeeForm.controls['password'];
  }

  get password2() {
    return this.employeeForm.controls['password2'];
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

  submit(){

    if( this.employeeForm.invalid){
      this.employeeForm.markAllAsTouched();
      return;
    }

    if( this.data.create){

      const newEmployee: CreateEmployee = {
        doc_num: this.doc_num.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        date_of_birth: this.date_of_birth.value,
        sex: this.sex.value,
        job: this.job.value,
        hire_date: this.hire_date.value,
        id_location: this.employeeForm.controls['location'].value,
        is_active: 'true',
        avatar: this.file,
        email: this.email.value,
        password: this.password.value
      }

      this._employeeService.createEmployee(newEmployee)
        .subscribe({
          next: resp => {
            this.dialogRef.close(true);
          }
        });

    }

    if ( this.data.update ){

      const idEmployee: number = this.employee?.id!;

      const editEmployee: EditEmployee = {
        id: idEmployee,
        doc_num: this.doc_num.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        date_of_birth: this.date_of_birth.value,
        sex: this.sex.value,
        job: this.job.value,
        hire_date: this.hire_date.value,
        id_location: this.employeeForm.controls['location'].value,
        is_active: 'true',
        avatar: this.file,
        email: this.email.value,
      }

      this._employeeService.update(editEmployee)
        .subscribe({
          next: resp => {
            this.dialogRef.close(true);
          }
        });

    }

  }

  browseImage() {
    const fileInput = this.fileInput.nativeElement;

    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      const filename: string = file?.name || '';
      this.employeeForm.controls['image'].setValue(filename);
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
