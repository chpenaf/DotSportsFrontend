import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message,action,
      {
        duration: 3000,
      })
  }

  createEmployee() {

    const dialogRef = this._dialog.open(FormComponent,
      {
        data: {
          title: 'Crear Empleado',
          create: true,
          update: false
        }
      });

    dialogRef.afterClosed().subscribe(
      result => {
        if ( result ){
          //this.refreshLocations();
          this.openSnackBar('Empleado creado correctamente','Cerrar');
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );

  }
}
