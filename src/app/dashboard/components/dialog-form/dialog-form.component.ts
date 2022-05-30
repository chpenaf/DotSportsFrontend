import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogForm } from '../../interfaces/dialog.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogForm
  ) { }

  form = this._fb.group(
    {
      input1: [ , [ Validators.required ] ]
    }
  )

  get input1(){
    return this.form.controls['input1'];
  }

  ngOnInit(): void {
  }

  save(){

    if( this.form.invalid ){
      this.form.markAllAsTouched();
      return;
    }

    this.data.input1.value = this.input1.value;

    this.dialogRef.close(true);

  }



}
