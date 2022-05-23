import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import * as moment from 'moment';

import { LocationSelect, PoolSelect } from '../../../dashboard/interfaces/location.interface';
import { LocationService } from '../../../dashboard/services/location.service';
import { CalendarService } from '../../../dashboard/services/calendar.service';
import { CalendarMember, SlotMember } from '../../../dashboard/interfaces/calendar.interface';
import { BookingService } from '../../../dashboard/services/booking.service';
import { DialogsService } from '../../../dashboard/components/dialogs.service';
import { Booking } from '../../../dashboard/interfaces/booking.interface';
import { MembersService } from '../../../dashboard/services/members.service';
import { Member } from '../../../dashboard/interfaces/member.interface';
import { CreditsService } from '../../../dashboard/services/credits.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  listLocation: LocationSelect[] = [];
  listPools: PoolSelect[] = [];
  listCalendar: CalendarMember[] = [];
  credits: number = 0;

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _router: Router,
    private _bookingService: BookingService,
    private _creditService: CreditsService,
    private _dialogService: DialogsService,
    private _locationService: LocationService,
    private _memberService: MembersService,
    private _calendarService: CalendarService
  ) { }

  selfInfo: Member = this._memberService.myInfo;

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
      .pipe(
        tap(
          resp => {
            this._memberService.selfInfo()
              .pipe(
                tap(
                  resp => {
                    this._creditService.getQuantCredits(resp.id)
                      .subscribe(
                        quant => this.credits = quant.quantity
                      )
                  }
                )
              )
              .subscribe(
                selfInfo => {
                  this.selfInfo = selfInfo;
                }
              )
          }
        )
      )
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
          this.listCalendar.forEach( item => {
            item.date = moment(item.date).locale('es').format('DD MMMM')
          });
        }
      )
  }

  booking(calendar: CalendarMember, slot: SlotMember){
    const booking: Booking = {
      member: this.selfInfo.id,
      calendar: calendar.id,
      slot: slot.id,
      location: this.location.value,
      pool: this.pool.value
    }

    this._dialogService.dialogToConfirm(
      'Reservar',
      '¿Confirma reserva?'
    ).subscribe(
      result => {
        if( result ){
          this._bookingService.create(booking)
            .subscribe({
              next: resp => {
                this._dialogService.openSnackBar(resp.message,'Cerrar');
              },
              error: err => {
                this._dialogService.openSnackBar(err.error.message,'Cerrar');
              }
            });
        } else {
          this._dialogService.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    )

  }

  back(){
    this._location.back();
  }

  myBookings(){
    this._router.navigate(['/dashboard-member/my-bookings'])
  }

  myCredits(){
    this._router.navigate(['/dashboard-member/my-credits'])
  }

}
