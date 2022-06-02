import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { Slot, SlotDialog, Calendar, Lane, SlotMemberDialog } from '../../../interfaces/calendar.interface';
import { PoolSelect } from '../../../interfaces/location.interface';
import { CalendarService } from '../../../services/calendar.service';
import { BookingService } from '../../../services/booking.service';
import { MembersComponent } from '../members/members.component';
import { DialogsService } from '../../../components/dialogs.service';

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
    private _bookingService: BookingService,
    private _calendarService: CalendarService,
    private _dialogService: DialogsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlotDialog,
  ) { }

  getSlotCssClass(lane: Lane){
    if(lane.desc === 'Nado Libre'){
      return 'slot nadolibre';
    } else {
      return 'slot curso';
    }
  }

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
      this._calendarService.getPlanningDay(this.day.location, this.pool.id, date)
        .subscribe(
          resp => {
            console.log(resp)
            this.slots = resp;
          }
        );
    }

  }

  slotClick(slot: Slot){

    if(!slot.id){
      return;
    }

    this._bookingService.getBySlot(slot.id)
      .subscribe(
        resp => {
          if( resp.length ){
            const slotMemberDialog: SlotMemberDialog = {
              members: resp
            }
            this.showSlotMemberDialog(slotMemberDialog);
          } else {
            this._dialogService.openSnackBar('No se encontraron reservas para el bloque','Cerrar');
          }
        }
      )
  }

  showSlotMemberDialog(dialog: SlotMemberDialog){
    const dialogRef = this.dialog.open(
      MembersComponent, {
        width: '600px',
        data: dialog
      }
    );
  }

}
