import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { EmployeeService } from '../../services/employee.service';
import { ListMembers } from '../../interfaces/member.interface';
import { LocationService } from '../../services/location.service';
import { LocationSelect } from '../../interfaces/location.interface';
import { MembersService } from '../../services/members.service';
import { Slot } from '../../interfaces/calendar.interface';
import { CalendarService } from '../../services/calendar.service';
import { CreditsService } from '../../services/credits.service';
import { CreditsComponent } from '../../components/credits/credits.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {

  listLocations: LocationSelect[] = [];

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
    private _calendarService: CalendarService,
    private _creditService: CreditsService,
    private _locationService: LocationService,
    private _employeeService: EmployeeService,
    private _memberService: MembersService
  ) { }

  ngAfterViewInit(): void {

  }

  bookingForm: FormGroup = this._fb.group(
    {
      location: [, [ Validators.required ] ],
      member: [ , [ Validators.required ] ]
    }
  )

  get location(){
    return this.bookingForm.controls['location'];
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

    this._employeeService.getLogged()
      .subscribe(
        resp => {
          this.location.setValue(resp.location?.id);
        }
      )

    this._locationService.getLocationToSelect()
      .subscribe(
        resp => this.listLocations = resp
      );

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
          console.log(resp);
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

}
