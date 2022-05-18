import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { Slot, SlotDialog, Calendar } from '../../../interfaces/calendar.interface';
import { PoolSelect } from '../../../interfaces/location.interface';
import { CourseService } from '../../../services/course.service';

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
    private courseService: CourseService,
    public dialogRef: MatDialogRef<SlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlotDialog,
  ) { }

  ngOnInit(): void {

    if( this.data.day ){
      this.day = this.data.day;
    }

    if( this.day.date ){
      const date = moment(this.day.date).toDate()
      this.courseService.getSessions(date)
        .subscribe(
          resp => {
            console.log(resp);
            console.log(this.data.slots);
            if( this.data.slots ){
              this.data.slots.forEach( slot => {
                let session = resp.find( session => session.slot = slot.id );
                if(session?.desc){
                  slot.desc = session.desc;
                } else {
                  slot.desc = 'NL';
                }
                this.slots.push(slot);
                session = {};
              });
            }
          }
        );
    }

    if( this.data.pool ){
      this.pool = this.data.pool;
    }

  }

}
