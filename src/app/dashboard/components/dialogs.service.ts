import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogToConfirmComponent } from './dialog-to-confirm/dialog-to-confirm.component';

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

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2500
    });
  }

}
