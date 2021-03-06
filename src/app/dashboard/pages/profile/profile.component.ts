import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import * as moment from 'moment';

import { DialogsService } from '../../components/dialogs.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EditEmployee } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild("fileInput", {static:false}) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("image", {static:false}) image!: ElementRef<HTMLImageElement>;

  file!: File;
  imgTmp: any = '';
  imgName: string = '';

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _dialogService: DialogsService,
    private _employeeService: EmployeeService
  ) { }

  myInfo: Employee = this._employeeService.myInfo;

  profileForm = this._fb.group({
    id: [ this.myInfo.id, [ Validators.required ] ],
    doc_num: [ this.myInfo.doc_num, [ Validators.required ] ],
    first_name: [ this.myInfo.first_name, [ Validators.required ] ],
    last_name: [ this.myInfo.last_name, [ Validators.required ] ],
    date_of_birth: [ this.myInfo.date_of_birth, [ Validators.required ] ],
    email: [ this.myInfo.user.email, [ Validators.required, Validators.email ] ]
  });

  get id(){
    return this.profileForm.controls['id'];
  }

  get doc_num(){
    return this.profileForm.controls['doc_num'];
  }

  get first_name(){
    return this.profileForm.controls['first_name'];
  }

  get last_name(){
    return this.profileForm.controls['last_name'];
  }

  get date_of_birth(){
    return this.profileForm.controls['date_of_birth'];
  }

  get email(){
    return this.profileForm.controls['email'];
  }

  ngOnInit(): void {

    this._employeeService.getLogged()
      .subscribe({
        next: resp => {
          this.myInfo = resp
          this.fillForm();
        }
      });

    this.id.disable();
    this.doc_num.disable();

  }

  fillForm(){
    this.id.setValue(this.myInfo.id);
    this.doc_num.setValue(this.myInfo.doc_num);
    this.first_name.setValue(this.myInfo.first_name);
    this.last_name.setValue(this.myInfo.last_name);
    this.email.setValue(this.myInfo.user.email);
  }

  back(){
    this._location.back();
  }

  save(){

    const updEmployee: EditEmployee = {
      id: this.profileForm.getRawValue().id,
      doc_num: this.profileForm.getRawValue().doc_num,
      first_name: this.profileForm.getRawValue().first_name,
      last_name: this.profileForm.getRawValue().last_name,
      date_of_birth: moment(this.myInfo.date_of_birth).format('YYYY-MM-DD'),
      sex: this.myInfo.sex,
      job: this.myInfo.job,
      hire_date: moment(this.myInfo.hire_date).format('YYYY-MM-DD'),
      id_location: this.myInfo.location?.id!,
      is_active: this.myInfo.is_active ? 'true' : 'false',
      email: this.profileForm.getRawValue().email
    }

    if( this.file ){
      updEmployee.avatar = this.file;
    }

    this._dialogService.dialogToConfirm(
      'Actualizar perfil',
      '??Desea guardar cambios'
    ).subscribe(
      result => {
        if( result ) {
          this._employeeService.update(updEmployee)
            .subscribe({
              next: resp => {
                this._dialogService.openSnackBar('Datos actualizados','Cerrar');
              },
              error: err => {
                this._dialogService.openSnackBar('Error al actualizar','Cerrar');
              }
            })
        } else {
          this._dialogService.openSnackBar('Acci??n cancelada','Cerrar');
        }
      }
    )

  }

  browseImage() {
    const fileInput = this.fileInput.nativeElement;

    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      const filename: string = file?.name || '';
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
