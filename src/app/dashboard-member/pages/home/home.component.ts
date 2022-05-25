import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from '@angular/common';

import { tap } from 'rxjs/operators';
import * as moment from 'moment';

import { MembersService } from '../../../dashboard/services/members.service';
import { Member } from '../../../dashboard/interfaces/member.interface';
import { BookingService } from '../../../dashboard/services/booking.service';
import { Booking } from '../../../dashboard/interfaces/booking.interface';
import { DialogsService } from '../../../dashboard/components/dialogs.service';
import { CreditsService } from '../../../dashboard/services/credits.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private _router: Router,
    private _bookingService: BookingService,
    private _creditService: CreditsService,
    private _dialogService: DialogsService,
    private _memberService: MembersService
  ) { }

  myInfo: Member = this._memberService.myInfo;
  nextBook: Booking = {};
  date: string = '';
  starttime: Time = {
    hours: 0,
    minutes: 0
  }
  endtime: Time = {
    hours: 0,
    minutes: 0
  }
  credits: number = 0;

  ngOnInit(): void {
    this._memberService.selfInfo()
      .pipe(
        tap(
          resp => {
            this.getNextBook();
            this.getCredits( resp.id );
          }
        )
      )
      .subscribe({
        next: info => {
          this.myInfo = info;
        }
      });
  }

  getNextBook(){
    this._bookingService.getNextBook()
      .subscribe({
        next: book => {
          this.nextBook = book;
          if( typeof book.slot != 'number' ){
            if( book.slot?.starttime ){
              this.starttime = book.slot?.starttime;
            }
            if( book.slot?.endtime ){
              this.endtime = book.slot?.endtime;
            }
          }
          if( typeof book.credit_pos != 'number' ){
            this.date = moment(book.credit_pos?.used_at)
              .locale('es')
              .format('dddd DD, MMMM');
          }
        }
      });
  }

  cancel() {
    this._dialogService.dialogToConfirm(
      'Anular hora',
      '¿Desea anular la hora?'
    ).subscribe(
      result => {
        if( result ) {
          if( this.nextBook.id ){
            this._bookingService.delete(this.nextBook.id)
              .subscribe({
                next: resp => {
                  this._dialogService.openSnackBar(resp.message,'Cerrar');
                  this.getNextBook();
                  this.getCredits(this.myInfo.id);
                },
                error: err => {
                  this._dialogService.openSnackBar(err.error.message,'Cerrar');
                }
              });
          }
        } else {
          this._dialogService.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );
  }

  getCredits(id: number){
    this._creditService.getQuantCredits(id)
      .subscribe(
        resp => this.credits = resp.quantity
      );
  }

  profile() {
    this._router.navigate(['/dashboard-member/profile']);
  }

  viewCredits(){
    this._router.navigate(['/dashboard-member/my-credits']);
  }

}
