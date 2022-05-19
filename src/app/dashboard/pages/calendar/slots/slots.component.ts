import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { Slot, SlotDialog, Calendar } from '../../../interfaces/calendar.interface';
import { PoolSelect } from '../../../interfaces/location.interface';
import { CalendarService } from '../../../services/calendar.service';

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
    private calendarService: CalendarService,
    public dialogRef: MatDialogRef<SlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlotDialog,
  ) { }

  ngOnInit(): void {

    if( this.data.day ){
      this.day = this.data.day;
    }

    if( this.data.pool ){
      this.pool = this.data.pool;
    }

    if( this.day.date ){
      const date = moment(this.day.date).toDate()
      if( !this.day.location ){
        return;
      }
      this.calendarService.getPlanningDay(this.day.location, this.pool.id, date)
        .subscribe(
          resp => {
            console.log(resp)
            this.slots = resp;
          }
        )
    }

  }

}
