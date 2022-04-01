import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogToConfirm } from '../../interfaces/dialog.interface'

@Component({
  selector: 'app-dialog-to-confirm',
  templateUrl: './dialog-to-confirm.component.html',
  styleUrls: ['./dialog-to-confirm.component.css']
})
export class DialogToConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: DialogToConfirm
  ) { }

  ngOnInit(): void {
  }

}
