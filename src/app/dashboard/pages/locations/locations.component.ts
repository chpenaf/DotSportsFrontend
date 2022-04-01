import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateFormComponent } from './create-form/create-form.component';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';
import { DialogToConfirmComponent } from '../../components/dialog-to-confirm/dialog-to-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  locations: Location[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _locationService: LocationService,
  ) { }

  ngOnInit(): void {
    this.refreshLocations();
  }

  openCreateLocationDialog() {
    const dialogRef = this._dialog.open(CreateFormComponent,
      {
        data: {
          title: 'Crear Sede',
          create: true,
          update: false
        }
      });

    dialogRef.afterClosed().subscribe(
      result => {
        if ( result ){
          this.refreshLocations();
          this.openSnackBar('Sede creada correctamente','Cerrar');
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );

  }

  update(location: Location){

    const dialogRef = this._dialog.open(CreateFormComponent,
      {
        data: {
          title: 'Editar Sede',
          create: false,
          update: true,
          location: location
        }
      });

    dialogRef.afterClosed().subscribe(
      result => {
        if ( result ){
          this.refreshLocations();
          this.openSnackBar('Sede actualizada correctamente','Cerrar');
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );

  }

  cancel(location: Location){

    const dialogRef = this._dialog.open(
      DialogToConfirmComponent, {
        data: {
          title: 'Anular Sede',
          message: `¿Está seguro de anular ${ location.name }?`,
          id: location.id,
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
          this._locationService.cancelLocation( location )
            .subscribe(
              resp => {
                this.openSnackBar(resp.message,'Cerrar');
              }
            )
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );
  }

  refreshLocations() {
    this._locationService.getLocations()
      .subscribe(
        resp => {
          this.locations = resp.results;
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
