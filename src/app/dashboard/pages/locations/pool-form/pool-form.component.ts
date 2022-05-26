import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PoolForm, Pool } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location.service';
import { DialogToConfirmComponent as dialogConfirm } from '../../../components/dialog-to-confirm/dialog-to-confirm.component'


@Component({
  selector: 'app-pool-form',
  templateUrl: './pool-form.component.html',
  styleUrls: ['./pool-form.component.css']
})
export class PoolFormComponent implements OnInit {

  listPools: Pool[] = [];

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<PoolFormComponent>,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: PoolForm
  ) {
    this._dialogRef.disableClose = true;
   }

  poolsForm: FormGroup = this._fb.group(
    {
      pools: this._fb.array([])
    }
  )

  get pools(){
    return this.poolsForm.controls['pools'] as FormArray;
  }

  ngOnInit(): void {
    this._locationService.getPools(this.data.location)
      .subscribe(
        resp => {
          this.listPools = resp;
          this.fillPoolsForm();
        }
      )
  }

  fillPoolsForm(){
    this.listPools.forEach( pool => {
      this.addPool(pool);
    })
  }

  addPool(pool?:Pool){
    const poolForm = this._fb.group(
      {
        id: [ pool?.id, ],
        name: [ pool?.name, [ Validators.required ] ],
        lanes: [ pool?.lanes, Validators.required ],
        width: [ pool?.width, Validators.required ],
        length: [ pool?.length, Validators.required ],
        min_depth: [ pool?.min_depth, Validators.required ],
        max_depth: [ pool?.max_depth, Validators.required ],
        is_available: [ pool?.is_available ],
      }
    );
    poolForm.controls['id'].disable();
    this.pools.push(poolForm);
  }

  removePool(index: number){

    const poolForm: FormGroup = this.pools.at(index) as FormGroup;
    if(poolForm.controls['id'].value){
      const id = poolForm.controls['id'].value;

      const dialogRef = this._dialog.open(
        dialogConfirm, {
          data: {
            title: 'Anular Sede',
            message: `¿Está seguro de anular piscina?`,
            id: id,
            cancel: {
              text: 'Cancelar'
            },
            confirm: {
              text: 'Confirmar',
              color: 'warn'
            }
          }
      });

      dialogRef.afterClosed().subscribe(
        result => {
          if ( result ){
            this._locationService.removePool( id )
              .subscribe(
                resp => {
                  console.log(resp)
                  this.pools.removeAt(index);
                }
              );
          } else {
            this.openSnackBar('Acción cancelada','Cerrar');
          }
        }
      );

    } else {
      this.pools.removeAt(index);
    }
  }

  submit(){
    this._dialogRef.disableClose = true;

    if( this.poolsForm.invalid ){
      this.poolsForm.markAllAsTouched();
      return;
    }

    const pools: Pool[] = [];

    this.pools.controls.forEach(poolForm => {
      const pool: Pool = poolForm.value;
      if( this.data.location.id ){
        pool.location = this.data.location.id;
      }
      pool.id = ( poolForm as FormGroup ).controls['id'].value;
      pool.is_available = true;
      pools.push(pool);
    })

    this._locationService.savePool(pools)
      .subscribe(
        resp =>{
          this._dialogRef.close( true )
        }
      )


  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message,action,
      {
        duration: 3000,
      })
  }
}


