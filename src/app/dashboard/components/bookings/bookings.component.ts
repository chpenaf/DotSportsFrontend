import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Booking, BookingDialog } from '../../interfaces/booking.interface';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  listBookings: Booking[] = [];

  constructor(
    private _bookingService: BookingService,
    public dialogRef: MatDialogRef<BookingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialog
  ) { }

  ngOnInit(): void {

    if( this.data.member ){
      this._bookingService.getByMember( this.data.member )
        .subscribe({
          next: resp => {
            this.listBookings = resp;
            console.log(resp);
          }
        });

    }

  }

}
