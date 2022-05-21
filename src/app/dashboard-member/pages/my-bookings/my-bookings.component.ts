import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { BookingService } from '../../../dashboard/services/booking.service';
import { MembersService } from '../../../dashboard/services/members.service';
import { Member } from '../../../dashboard/interfaces/member.interface';
import { Booking } from '../../../dashboard/interfaces/booking.interface';
import { DialogsService } from '../../../dashboard/components/dialogs.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {

  listBookings: Booking[] = [];
  oldBookings: Booking[] = [];
  currentBookings: Booking[] = [];

  oldColumns: string[] = [
    'id',
    'date',
    'starttime',
  ]

  currentColumns: string[] = [
    'id',
    'date',
    'starttime',
    'cancel'
  ]

  constructor(
    private _bookingService: BookingService,
    private _dialogService: DialogsService,
    private _memberService: MembersService,
    private _router: Router
  ) { }

  myInfo: Member = this._memberService.myInfo;

  ngOnInit(): void {

    this._memberService.selfInfo()
      .pipe(
        tap(
          resp => this.getBooking( resp.id )
        )
      )
      .subscribe({
        next: resp => this.myInfo = resp,
        error: err => console.log(err)
      });

  }

  getBooking( idMember: number ){
    this._bookingService.getByMember( idMember )
      .subscribe({
        next: resp => {
          this.listBookings = resp;
          if( this.listBookings ){
            this.currentBookings = this.listBookings.filter( item => item.old == false );
            this.oldBookings = this.listBookings.filter( item => item.old == true );
          }
        }
      });
  }

  delete(booking: Booking){
    if( booking.id ){
      this._dialogService.dialogToConfirm(
        'Anular reserva',
        '¿Desea anular la reserva?'
      ).subscribe(
        result => {
          if( result ){
            if( booking.id ){
              this._bookingService.delete(booking.id)
                .subscribe({
                  next: resp => {
                    this._dialogService.openSnackBar(resp.message,'Cerrar');
                    if( booking.member ){
                      this.getBooking(booking.member);
                    }
                  },
                  error: err => {
                    this._dialogService.openSnackBar(err.error.message, 'Cerrar');
                  }
                });
            }
          } else {
            this._dialogService.openSnackBar('Acción cancelada','Cerrar');
          }
        }
      )
    }
  }

  back(){
    this._router.navigate(['/dashboard-member/booking/'])
  }

}
