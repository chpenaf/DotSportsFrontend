import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Slot, SlotDialog, Calendar } from '../../../interfaces/calendar.interface';
import { PoolSelect } from '../../../interfaces/location.interface';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {

  day: Calendar = {};
  pool: PoolSelect = {
    id: 0,
    name: ''
  };
  slots: Slot[] = [];

  constructor(
    public dialogRef: MatDialogRef<SlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlotDialog,
  ) { }

  ngOnInit(): void {

    console.log(this.data);

    if( this.data.day ){
      this.day = this.data.day;
    }

    if( this.data.slots ){
      this.slots = this.data.slots;
    }

    if( this.data.pool ){
      this.pool = this.data.pool;
    }

    console.log(this.data);

  }

}
