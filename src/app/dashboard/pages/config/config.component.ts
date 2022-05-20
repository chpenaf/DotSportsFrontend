import { Component, OnInit } from '@angular/core';

import { CapacityPool } from '../../interfaces/config.interface';
import { ConfigService } from '../../services/config.service';
import { DialogsService } from '../../components/dialogs.service';
import { MatDialog } from '@angular/material/dialog';
import { CapacityFormComponent } from './capacity-form/capacity-form.component';
import { PoolSelect } from '../../interfaces/location.interface';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  capacityPool: CapacityPool[] = [];

  capacityColumns: string[] = [
    'location',
    'pool',
    'capacity_lane',
    'begin_validity',
    'end_validity',
    'edit',
    'delete'
  ];

  constructor(
    private _configService: ConfigService,
    private _dialogService: DialogsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.getCapacity();

  }

  getCapacity(): void {

    this._configService.getCapacityPool()
      .subscribe(
        resp => {
          this.capacityPool = resp;
        }
      );

  }

  addCapacity(): void {

    const dialogRef = this.dialog.open(
      CapacityFormComponent, {
        data: {
          title: 'Aforo Piscina',
          data: null
        }
      }
    );

    dialogRef.afterClosed()
      .subscribe(
        result => {
          if( result == true ){
            this.getCapacity();
            this._dialogService.openSnackBar('Agregado correctamente','Cerrar');
          } else {
            this._dialogService.openSnackBar('Acción cancelada','Cerrar');
          }
        }
      );

  }

  editCapacity(capacity: CapacityPool): void {

    if( typeof capacity.location == "number"){
      return;
    }

    if( typeof capacity.pool == "number"){
      return;
    }

    const data: CapacityPool = {
      id: capacity.id,
      location: capacity.location.id,
      pool: capacity.pool.id,
      capacity_lane: capacity.capacity_lane,
      begin_validity: capacity.begin_validity,
      end_validity: capacity.end_validity
    }

    const dialogRef = this.dialog.open(
      CapacityFormComponent, {
        data: {
          title: 'Aforo Piscina',
          data: data
        }
      }
    );

    dialogRef.afterClosed()
      .subscribe(
        result => {
          if( result == true ){
            this.getCapacity();
            this._dialogService.openSnackBar('Actualizado correctamente','Cerrar');
          } else {
            this._dialogService.openSnackBar('Acción cancelada','Cerrar');
          }
        }
      );

  }

  deleteCapacity(capacity: CapacityPool): void {

    this._dialogService.dialogToConfirm(
      'Eliminar aforo',
      '¿Desea eliminar el aforo seleccionado?')
      .subscribe(
        result => {
          if( ( result == true ) && ( capacity.id ) ){
            this._configService.deleteCapacityPool(capacity.id)
              .subscribe(
                resp => {
                  if( resp.ok == true ){
                    this._dialogService.openSnackBar('Eliminado correctamente','Cerrar');
                  } else {
                    this._dialogService.openSnackBar('Error al eliminar','Cerrar');
                  }
                }
              );
          } else {
            this._dialogService.openSnackBar('Acción cancelada','Cerrar');
          }
        }
      )



  }

}
