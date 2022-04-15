import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { ListEmployee } from '../../interfaces/employee.interface';
import { EmployeeService } from '../../services/employee.service';
import { DialogToConfirmComponent } from '../../components/dialog-to-confirm/dialog-to-confirm.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  displayedColumns: string[] = [
    'avatar',
    'doc_num',
    'full_name',
    'email',
    'job_name',
    'location',
    'hire_date',
    'is_active',
    'edit',
    'cancel'
  ]

  dataSource: MatTableDataSource<ListEmployee> = new MatTableDataSource();
  listEmployees: ListEmployee[] = [];

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _employeeService: EmployeeService
  ) {

   }

  ngOnInit(): void {

    this.fillDataSource();

  }

  fillDataSource() {

    this._employeeService.listEmployees()
      .subscribe(
        resp => {
          this.listEmployees = resp;
          this.dataSource.data = this.listEmployees;
        }
      );
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
          this.openSnackBar('Empleado creado correctamente','Cerrar');
          this.fillDataSource();
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );

  }

  applyFilter(event: Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  update( id: number ){

    this._employeeService.get(id)
      .subscribe(
        resp => {
          const dialogRef = this._dialog.open(FormComponent,
            {
              data: {
                title: 'Editar Empleado',
                create: false,
                update: true,
                employee: resp,
                id: id
              }
            });

          dialogRef.afterClosed().subscribe(
            result => {
              if ( result ){
                this.openSnackBar('Empleado actualizado correctamente','Cerrar');
                this.fillDataSource();
              } else {
                this.openSnackBar('Acción cancelada','Cerrar');
              }
            }
          );
        }
      )


  }

  cancel( id: number ){
    const dialogRef = this._dialog.open(
      DialogToConfirmComponent, {
        data: {
          title: 'Anular Empleado',
          message: `¿Está seguro de anular el empleado?`,
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
          this._employeeService.cancel( id )
            .subscribe(
              resp => {
                this.openSnackBar(resp.message,'Cerrar');
                this.fillDataSource();
              }
            )
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );
  }

}
