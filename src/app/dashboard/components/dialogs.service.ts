import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogToConfirmComponent } from './dialog-to-confirm/dialog-to-confirm.component';
import { DialogForm } from '../interfaces/dialog.interface';
import { DialogFormComponent } from './dialog-form/dialog-form.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }


  dialogToConfirm(title: string, message: string){
    const dialogRef = this._dialog.open(
      DialogToConfirmComponent, {
        data: {
          title: title,
          message: message,
          cancel: {
            text: 'Cancelar'
          },
          confirm: {
            text: 'Confirmar',
            color: 'warn'
          }
        }
      }
    );

    return dialogRef.afterClosed();
  }

  informativo(title: string, message: string){
    const dialogRef = this._dialog.open(
      DialogToConfirmComponent, {
        data: {
          title: title,
          message: message,
          confirm: {
            text: 'Cerrar',
            color: 'primary'
          }
        }
      }
    );
    return dialogRef.afterClosed();
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2500
    });
  }

  dialogForm(dialogForm: DialogForm){

    const dialogRef = this._dialog.open(
      DialogFormComponent, {
        width: '400px',
        data: dialogForm
      }
    );

    return dialogRef.afterClosed();

  }

}
