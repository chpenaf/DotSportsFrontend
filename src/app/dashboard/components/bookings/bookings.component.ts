import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Booking, BookingDialog } from '../../interfaces/booking.interface';
import { BookingService } from '../../services/booking.service';
import { DialogsService } from '../dialogs.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  listBookings: Booking[] = [];
  oldBookings: Booking[] = [];
  currentBookings: Booking[] = [];

  oldColumns: string[] = [
    'id',
    'date',
    'starttime',
    'location',
    'pool'
  ]

  currentColumns: string[] = [
    'id',
    'date',
    'starttime',
    'location',
    'pool',
    'cancel'
  ]

  constructor(
    private _bookingService: BookingService,
    private _dialogService: DialogsService,
    public dialogRef: MatDialogRef<BookingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialog
  ) { }

  ngOnInit(): void {

    if( this.data.member ){
      this.getBooking(this.data.member);
    }

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

}
