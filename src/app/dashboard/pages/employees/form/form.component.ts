import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as moment from 'moment';

import { FnValidaRut } from '../../../../shared/custom-validators';
import { DocnumValidatorService } from '../../../../shared/validator/docnum-validator.service';
import { EmployeesComponent } from '../employees.component';
import { EmployeeForm } from '../../../interfaces/employee.interface';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../../app.component';

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

  constructor(
    private _fb: FormBuilder,
    private _docnumValidator: DocnumValidatorService,
    public dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeForm
  ) { }

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
      job: [ this.employee?.job, [ Validators.required ] ],
      hire_date: [ this.employee?.hire_date, [ Validators.required ] ],
      image: [ , [ ] ],
      // location?: Location;
      // user: User;
      // is_active: boolean;
    }
  );

  ngOnInit(): void {

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

  submit(){
    console.log('submit');
  }

  browseImage() {
    const fileInput = this.fileInput.nativeElement;

    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      const filename: string = file?.name || '';
      this.employeeForm.controls['image'].setValue(filename);
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
