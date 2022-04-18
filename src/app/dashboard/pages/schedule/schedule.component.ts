import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MY_DATE_FORMATS } from '../../../app.component';
import { ChoiceField } from '../../../shared/interfaces/shared.interface';
import { LocationSelect } from '../../interfaces/location.interface';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, Slot, DayType, DayTypeKey } from '../../interfaces/schedule.interface';
import * as moment from 'moment';
import { Time } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class ScheduleComponent implements OnInit {

  listLocations: LocationSelect[] = [];
  dayTypeList: ChoiceField[] = [];

  listSchedules: Schedule[] = [];

  searched: boolean = false;
  searching: boolean = false;

  showForm: boolean = false;

  schedule: Schedule = {
    location: {
      id: 0,
      name: ''
    },
    days: []
  }

  displayedColumns: string[] = ['position','starttime','endtime','delete'];

  constructor(
    private _fb: FormBuilder,
    private _employeeService: EmployeeService,
    private _locationService: LocationService,
    private _scheduleService: ScheduleService
  ) { }

  searchForm: FormGroup = this._fb.group(
    {
      location: [ , [ Validators.required ] ],
      ini_vig: [ , [ Validators.required ] ],
    }
  );

  scheduleForm: FormGroup = this._fb.group(
    {
      id: [],
      location: [],
      begin_validity: [ new Date(), Validators.required ],
      end_validity: [ '9999-12-31', Validators.required ],
      days: this._fb.array([]),
    }
  )

  addDay() {
    const dayForm = this._fb.group(
      {
        datatype: [],
        desc: [],
        is_open: [],
        slots: this._fb.array([])
      }
    );
    this.days.push(dayForm);
  }

  get ini_vig(){
    return this.searchForm.controls['ini_vig'];
  }

  get id(){
    return this.scheduleForm.controls['id'];
  }

  get location(){
    return this.scheduleForm.controls['location'];
  }

  get begin_validity(){
    return this.scheduleForm.controls['begin_validity'];
  }

  get end_validity(){
    return this.scheduleForm.controls['end_validity'];
  }

  get days(){
    return this.scheduleForm.controls['days'] as FormArray;
  }

  slots( dayTypeForm: FormGroup ){
    return dayTypeForm.controls['slots'] as FormArray;
  }

  setIniVig(date?: Date){
    if( date ) {
      this.ini_vig.setValue(date);
    }
    else {
      this.ini_vig.setValue(new Date());
    }
  }

  ngOnInit(): void {

    this._employeeService.getLogged()
      .subscribe(
        resp => {
          this.searchForm.controls['location'].setValue(resp.location?.id);
        }
      )

    this._locationService.getLocationToSelect()
      .subscribe(
        resp => this.listLocations = resp
      );

    this.setIniVig()

    this._scheduleService.getDayTypes()
        .subscribe(
          resp => this.dayTypeList = resp
        )

  }

  selectSchedule(schedule: Schedule) {

    if (!schedule.id){
      return;
    }

    this.resetScheduleForm();

    this._scheduleService.getSchedule(schedule.id)
      .subscribe(
        resp => {
          this.schedule = resp;
          this.fillScheduleForm();
          this.showForm = true;
        }
      )


  }

  searchSchedule() {

    if( this.searchForm.invalid ){
      return;
    }

    this.clearSearchForm();

    this.searching = true;

    this._scheduleService.getSchedules(this.searchForm.controls['location'].value)
      .subscribe(
        resp => {
          this.listSchedules = resp;
          this.searched = true;
          this.searching = false;
        }
      )
  }

  clearSearchForm(){
    this.searched = false;
    this.showForm = false;
    this.resetScheduleForm();
  }

  resetScheduleForm(){

    this.schedule = {
      location: {
        id: 0,
        name: ''
      },
      days: []
    }
    for( let i = this.days.length - 1; i >= 0 ; i-- ){
      this.days.removeAt(i);
    }
    this.scheduleForm.reset();
  }

  addSchedule(){

    this.showForm = true;

    const idLocation = this.searchForm.controls['location'].value

    this.location.setValue(idLocation);
    this.begin_validity.setValue(new Date());
    this.end_validity.setValue('9999-12-31');

    this.schedule.location = this.listLocations
                              .find( x => x.id == idLocation )!;

    this.dayTypeList.forEach(item => {
      const dayTypeForm = this._fb.group(
        {
          daytype: [ item.key ],
          desc: [ item.value ],
          is_open: [ false ],
          slots: this._fb.array([])
        }
      );
      this.days.push(dayTypeForm);
      }
    );

  }

  fillScheduleForm(){

    if( this.schedule.id ) {
      this.id.setValue(this.schedule.id);
    }

    this.location.setValue(this.schedule.location.id);
    this.begin_validity.setValue(this.schedule.begin_validity);
    this.end_validity.setValue(this.schedule.end_validity);

    if( this.schedule.days.length > 0 ) {

      this.schedule.days.forEach(item => {
        const dayTypeForm = this._fb.group(
          {
            daytype: [ item.daytype ],
            desc: [ item.desc ],
            is_open: [ item.is_open ],
            slots: this._fb.array([])
          }
        );

        if( item.slots.length > 0 ){

          item.slots.forEach(slot => {
            const slotForm = this._fb.group(
              {
                slot: [ slot.slot ],
                starttime: [ slot.starttime ],
                endtime: [ slot.endtime ]
              }
            );
            slotForm.controls['slot'].disable();
            this.slots(dayTypeForm).push(slotForm);
          });
        }

        this.days.push(dayTypeForm);
      });

    }

  }

  getTitle(index: number){
    const dayForm: FormGroup = this.days.at(index) as FormGroup;
    return dayForm.controls['desc'].value;
  }

  getSlotForm(index: number){
    const dayForm = this.days.at(index) as FormGroup;
    return dayForm.controls['slots'] as FormGroup;
  }

  print(any:any){
    console.log(any);
  }

  getSlotsControls(dayForm: any){
    const form = dayForm as FormGroup;
    return (form.controls['slots'] as FormArray).controls;
  }

  addSlot(index: number) {

    const dayForm = ( this.scheduleForm.controls['days'] as FormArray )
                      .at( index ) as FormGroup;
    const slots = dayForm.controls['slots'] as FormArray;
    const slotNo = slots.length + 1;
    const slotForm = this._fb.group(
      {
        slot: [ slotNo, Validators.required ],
        starttime: [ , Validators.required ],
        endtime: [ , Validators.required ]
      }
    );
    slotForm.controls['slot'].disable();

    slots.push(slotForm);

  }

  deleteSlot(index: number, jindex: number){
    this.getSlots(index).removeAt(jindex);
  }

  getSlots(index: number){
    return this.getDayForm(index).controls['slots'] as FormArray;
  }

  getDayForm(index: number){
    return this.days.at( index ) as FormGroup;
  }

  getOpen(index: number){
    return this.getDayForm(index).controls['is_open'].value;
  }

  submit(){

    if( this.scheduleForm.invalid){
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const form: Schedule = this.scheduleForm.value;

    const schedule: Schedule = {
      id: form.id,
      location: form.location,
      begin_validity: moment(form.begin_validity).format('YYYY-MM-DD'),
      end_validity: moment(form.end_validity).format('YYYY-MM-DD'),
      days: form.days
    }

    console.log(form);

    this._scheduleService.save(schedule)
      .subscribe(
        resp => {
          console.log(resp);
        }
      )

  }

  getStartTime(i:number,j:number){
    const slotForm = this.getSlots(i).at(j) as FormGroup;
    const starttime = slotForm.controls['starttime'].value;
    const oneTime = moment(starttime,'HH:mm:ss');

    const time: Time = {
      hours: Number(oneTime.format('HH')),
      minutes: Number(oneTime.format('mm'))
    }
    return time;
  }

}
