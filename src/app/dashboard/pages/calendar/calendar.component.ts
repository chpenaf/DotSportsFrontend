import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

import * as moment from 'moment';

import { LocationSelect } from '../../interfaces/location.interface';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { CalendarService } from '../../services/calendar.service';
import { Calendar } from '../../interfaces/calendar.interface';
import { DialogsService } from '../../components/dialogs.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SlotsComponent } from './slots/slots.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  months = [
    { key:1, value:'Enero' },
    { key:2, value:'Febrero' },
    { key:3, value:'Marzo' },
    { key:4, value:'Abril' },
    { key:5, value:'Mayo' },
    { key:6, value:'Junio' },
    { key:7, value:'Julio' },
    { key:8, value:'Agosto' },
    { key:9, value:'Septiembre' },
    { key:10, value:'Octubre' },
    { key:11, value:'Noviembre' },
    { key:12, value:'Diciembre' }
  ]

  weekdays = [
    { key:1, value:'Lunes' },
    { key:2, value:'Martes' },
    { key:3, value:'Miércoles' },
    { key:4, value:'Jueves' },
    { key:5, value:'Viernes' },
    { key:6, value:'Sábado' },
    { key:7, value:'Domingo' },
  ]

  listLocations: LocationSelect[] = [];
  calendarMonth: Calendar[] = [];

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _dialogService: DialogsService,
    private _calendarService: CalendarService,
    private _employeeService: EmployeeService,
    private _locationService: LocationService
  ) { }

  searchForm = this._fb.group(
    {
      location: [ , [ Validators.required ] ],
      year: [ , [ Validators.required, Validators.minLength(4) ] ],
      month: [ , [ Validators.required ] ]
    }
  )

  get location(){
    return this.searchForm.controls['location'];
  }

  get year(){
    return this.searchForm.controls['year'];
  }

  get month(){
    return this.searchForm.controls['month'];
  }

  ngOnInit(): void {

    this._locationService.getLocationToSelect()
      .pipe(
        tap(
          resp => {
            this._employeeService.getLogged()
            .subscribe(
              resp => {
                this.location.setValue(resp.location?.id);
              }
            );
          }
        )
      )
      .subscribe(
        resp => {
          this.listLocations = resp;
        }
      )

    const today = new Date;

    this.year.setValue( today.getFullYear() );
    this.month.setValue( today.getMonth() + 1 );

  }

  search(){
    this.calendarMonth = [];
    const search = this.searchForm.getRawValue();
    this._calendarService.getPlanningMonth(
        search.location,
        search.year,
        search.month
      )
      .subscribe(
        resp => {
          this.calendarMonth = resp;
        }
      )
  }

  clickDay(day: Calendar){

    if(!day.location){
      return;
    }

    if(!day.date){
      return;
    }

    const date = moment(day.date).toDate();

    this._calendarService.getAllSlots(day.location, date)
      .subscribe(
        resp => {
          if( resp.length ){
            // const dialogRef: MatDialogRef<SlotsComponent>;
            // this._dialog.open(

            // )
          } else {
            this._dialogService.informativo(
              'Información','No existen horas para el día seleccionado'
            )
          }
        }
      );
  }

}
