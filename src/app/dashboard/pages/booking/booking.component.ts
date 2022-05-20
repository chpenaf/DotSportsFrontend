import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';

import { Booking } from '../../interfaces/booking.interface';
import { BookingService } from '../../services/booking.service';
import { CalendarService } from '../../services/calendar.service';
import { CreditsComponent } from '../../components/credits/credits.component';
import { CreditsService } from '../../services/credits.service';
import { EmployeeService } from '../../services/employee.service';
import { ListMembers } from '../../interfaces/member.interface';
import { LocationService } from '../../services/location.service';
import { LocationSelect, PoolSelect } from '../../interfaces/location.interface';
import { MembersService } from '../../services/members.service';
import { Slot } from '../../interfaces/calendar.interface';
import { DialogsService } from '../../components/dialogs.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {

  listLocations: LocationSelect[] = [];
  listPools: PoolSelect[] = [];

  autoCompleteControl = new FormControl();
  listMembers: ListMembers[] = [];
  filteredMembers!: Observable<ListMembers[]>;
  memberSelected: ListMembers = {
    id: undefined,
    avatar: undefined,
    doc_num: '',
    full_name: '',
    age: 0,
    email: '',
    status: ''
  }

  dateSelected: Date = new Date();

  credits: number = 0;

  listSlots: Slot[] = [];

  searched: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _bookingService: BookingService,
    private _calendarService: CalendarService,
    private _creditService: CreditsService,
    private _dialogService: DialogsService,
    private _locationService: LocationService,
    private _employeeService: EmployeeService,
    private _memberService: MembersService
  ) { }

  ngAfterViewInit(): void {

  }

  bookingForm: FormGroup = this._fb.group(
    {
      location: [, [ Validators.required ] ],
      pool: [, [ Validators.required ] ],
      member: [ , [ Validators.required ] ]
    }
  )

  get location(){
    return this.bookingForm.controls['location'];
  }

  get pool(){
    return this.bookingForm.controls['pool'];
  }

  get member(){
    return this.bookingForm.controls['member'];
  }

  ngOnInit(): void {

    this._memberService.list('AC')
      .subscribe(
        data => {
          this.listMembers = data;
          this.filteredMembers = this.member.valueChanges.pipe(
            startWith(''),
            map(value => ( typeof value === 'string' ? value : value.full_name ) ),
            map(nombre => ( nombre ? this._filter(nombre): this.listMembers.slice() ))
          );
        }
      );

    this._locationService.getLocationToSelect()
      .pipe(
        tap( resp =>{
          this.listLocations = resp;
          this._employeeService.getLogged()
            .subscribe(
              resp => {
                this.location.setValue(resp.location?.id);
                this.fillPools();
              }
            )
        })
      )
      .subscribe(
        resp => this.listLocations = resp
      );


  }

  fillPools(){
    if( this.location.value ){
      const filtered = this.listLocations
        .filter(
          item => item.id === this.location.value
        );
      if( filtered[0].pools ){
        this.listPools = filtered[0].pools;
        if( this.listPools.length === 1 ){
          this.pool.setValue(this.listPools[0].id)
        }
      }
    }
  }

  private _filter(value: string): ListMembers[] {
    const filterValue = value.toLowerCase();
    return this.listMembers.filter(
      option => option.full_name.toLowerCase().includes(filterValue)
      );
  }

  displayMember(member: ListMembers): string {
    return member && member.full_name ? member.full_name : '';
  }

  memberChange( event: MatOptionSelectionChange, selected: ListMembers ){
    if( event.isUserInput ) {
      this.memberSelected = selected;
      this._creditService.getQuantCredits(selected.id!)
        .subscribe(
          resp => this.credits = resp.quantity
        )
    }
  }

  clearMember(){
    this.member.setValue('');
    this.memberSelected = {
      id: undefined,
      avatar: undefined,
      doc_num: '',
      full_name: '',
      age: 0,
      email: '',
      status: ''
    }
  }

  searchSlots(){

    const location = this.bookingForm.controls['location'].value;
    this.searched = true;
    this._calendarService.getSlots(location,this.dateSelected)
      .subscribe(
        resp => {
          this.listSlots = resp;
        }
      );
  }

  showCredits() {

    const dialogRef = this._dialog.open(CreditsComponent,{
      width: '800px',
      data: {
        title: 'Titulo',
        location: this.bookingForm.controls['location'].value,
        member: this.memberSelected
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        result => {
          this._creditService.getQuantCredits( this.memberSelected.id! )
            .subscribe(
              resp => this.credits = resp.quantity
            );
          return result;
        }
      )

  }

  booking(slot: Slot){

    if( this.bookingForm.invalid ){
      this.bookingForm.markAllAsTouched();
      return;
    }

    const booking: Booking = {
      member: this.member.value.id,
      calendar: slot.calendar,
      slot: slot.id,
      location: this.location.value,
      pool: this.pool.value
    }

    this._dialogService.dialogToConfirm(
      'Reservar',
      '¿Confirma que desea reservar hora?'
    ).subscribe(
      result => {
        if( result ){
          this._bookingService.create(booking)
            .subscribe({
              next: (resp) => {
                this._dialogService.openSnackBar(resp.message,'Cerrar');
                this._creditService.getQuantCredits( this.memberSelected.id! )
                  .subscribe(
                    resp => this.credits = resp.quantity
                  );
              },
              error: (err) => {
                this._dialogService.openSnackBar(err.error.message,'Cerrar');
              }
            });
        }
      }
    )



  }

}
