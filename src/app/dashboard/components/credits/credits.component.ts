import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

import { MY_DATE_FORMATS } from '../../../app.component';
import { CreditsService } from '../../services/credits.service';
import { CreditDialog, CreditHeader } from '../../interfaces/credits.interface';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class CreditsComponent implements OnInit {

  private _credits: CreditHeader[] = [];
  showForm: boolean = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CreditsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditDialog,
    private _creditService: CreditsService
  ) { }

  creditForm = this._fb.group(
    {
      quantity: [ , [ Validators.required, Validators.min(1), Validators.pattern(/^[0-9]\d*$/) ] ],
      begin_validity: [ new Date(), Validators.required ],
      doc_ref: [ , Validators.required ],
    }
  )

  get quantity(){
    return this.creditForm.controls['quantity'];
  }

  get begin_validity(){
    return this.creditForm.controls['begin_validity'];
  }

  get doc_ref(){
    return this.creditForm.controls['doc_ref'];
  }

  get credits(){
    return [...this._credits];
  }

  get quantityError(){

    const errors = this.quantity.errors;

    if ( errors?.['required'] ) {
      return 'Obligatorio.';
    } else if ( errors?.['min'] ) {
      return 'Mayor a 0';
    } else if ( errors?.['pattern'] ) {
      return 'Solo números';
    }

    return '';
  }

  ngOnInit(): void {
    this.getCredits();
  }

  getCredits( ){
    if( !this.data.member.id ){
      return;
    }

    this._creditService.getCredits( this.data.member.id )
      .subscribe(
        resp => this._credits = resp
      )
  }

  showAddCreditForm(){
    this.showForm = true;
  }

  saveCreditForm(){

    if( this.creditForm.invalid ){
      this.creditForm.markAllAsTouched();
      return;
    }

    const credit: CreditHeader = {
      location: this.data.location,
      member: this.data.member.id,
      quantity: this.quantity.value,
      begin_validity: moment(this.begin_validity.value).format('YYYY-MM-DD'),
      doc_ref: this.doc_ref.value
    }

    this._creditService.saveCredit( credit )
      .subscribe(
        resp => {
          this.getCredits();
          this.creditForm.markAsUntouched();
          this.creditForm.reset();
          this.showForm = false;
        }
      )
  }

  cancelCreditForm(){
    this.creditForm.markAsUntouched();
    this.creditForm.reset();
    this.showForm = false;
  }





}

