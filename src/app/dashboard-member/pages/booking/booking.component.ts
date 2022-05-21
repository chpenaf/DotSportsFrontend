import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LocationSelect, PoolSelect } from '../../../dashboard/interfaces/location.interface';
import { LocationService } from '../../../dashboard/services/location.service';
import { CalendarService } from '../../../dashboard/services/calendar.service';
import { CalendarMember, SlotMember } from '../../../dashboard/interfaces/calendar.interface';
import { BookingService } from '../../../dashboard/services/booking.service';
import { DialogsService } from '../../../dashboard/components/dialogs.service';
import { Booking } from '../../../dashboard/interfaces/booking.interface';
import { MembersService } from '../../../dashboard/services/members.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  listLocation: LocationSelect[] = [];
  listPools: PoolSelect[] = [];
  listCalendar: CalendarMember[] = [];

  constructor(
    private _fb: FormBuilder,
    private _bookingService: BookingService,
    // private _dialogService: DialogsService,
    private _locationService: LocationService,
    private _memberService: MembersService,
    private _calendarService: CalendarService
  ) { }

  bookingForm = this._fb.group(
    {
      location: [ , [ Validators.required ] ],
      pool: [ , [ Validators.required ] ]
    }
  )

  get location(){
    return this.bookingForm.controls['location'];
  }

  get pool(){
    return this.bookingForm.controls['pool'];
  }

  ngOnInit(): void {

    this._locationService.getLocationToSelect()
      .subscribe({
        next: response => {
          this.listLocation = response;
          if( this.listLocation.length == 1 ) {
            this.location.setValue(this.listLocation[0].id);
            this.fillListPools(this.listLocation[0]);
            if( this.location.value ){
              this.fillCalendarMember( this.location.value );
            }
          }
        }
      })
  }

  fillListPools(location: LocationSelect){
    if( location.pools ){
      this.listPools = location.pools;
      if( this.listPools.length == 1 ){
        this.pool.setValue(this.listPools[0].id);
      }
    }
  }

  fillCalendarMember(idLocation: number){
    this._calendarService.getSlotsMember(idLocation)
      .subscribe(
        resp => {
          this.listCalendar = resp;
        }
      )
  }

  booking(calendar: CalendarMember, slot: SlotMember){
    const booking: Booking = {
      member: 1, // TODO crear servicio para obtener miembro logueado
      calendar: calendar.id,
      slot: slot.id,
      location: this.location.value,
      pool: this.pool.value
    }
    this._bookingService.create(booking)
      .subscribe({
        next: resp => {
          console.log(resp);
        },
        error: err => {
          console.log(err);
        }
      });
  }

}
