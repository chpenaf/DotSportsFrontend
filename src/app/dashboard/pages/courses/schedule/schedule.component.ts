import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { Course, Schedule, DialogSchedule } from '../../../interfaces/courses.interface';
import { ScheduleService } from '../../../services/schedule.service';
import { Slot, WeekSchedule, CourseSchedule } from '../../../interfaces/schedule.interface';
import { DialogsService } from '../../../components/dialogs.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  listCourses: Course[] = [];
  weekSchedule: WeekSchedule[] = [];
  courseSchedule: CourseSchedule[] = [];

  courseSelected: Course = {};

  constructor(
    public dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSchedule,
    private _courseService: CourseService,
    private _dialogService: DialogsService,
    private _scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {

    this.listCourses = this.data.list;
    this.courseSelected = this.data.course;

    if( typeof this.courseSelected.location != 'number'){
      return;
    }

    this._scheduleService.getWeekSchedule(this.courseSelected.location)
      .subscribe(
        resp => {
          const week: WeekSchedule[] = []
          resp.forEach( item => {
            if( item.daytype == 'WD' ){
              item.slots.forEach(slot => {
                week.push({
                  monday: slot,
                  tuesday: slot,
                  wednesday: slot,
                  thursday: slot,
                  friday: slot
                });
              });
            } else if( item.daytype == 'SA' ){
              item.slots.forEach(slot => {
                week.forEach( day => {
                    if( day.monday?.starttime == slot.starttime ){
                      day.saturday = slot;
                    }
                });
              });
            }
          });
          this.weekSchedule = week;
        }
      );
  }

  toggle(event: MatButtonToggleChange, day: number){

    const slot: Slot = event.value;

    if( event.source.checked ){
      this.courseSchedule.push({ day, slot });
    } else {
      this.courseSchedule.forEach( (item, index) => {
        if( ( item.day == day ) && ( item.slot.starttime == slot.starttime ) ){
          this.courseSchedule.splice(index,1);
        }
      });
    }

  }

  checked(day: number, slot?: Slot){

    if(!slot){
      return false;
    }

    const course: Course | undefined = this.listCourses.find(
      item => item.id == this.courseSelected.id
    );

    if(!course){
      return false;
    }

    const schedule: Schedule | undefined = course.schedule?.find(
      item => item.slot == slot.id && item.weekday == day
    )

    if(schedule){
      return true;
    }


    return false;
  }

  saveSchedule(){

    const schedule: Schedule[] = [];

    if( this.courseSchedule.length == 0 ){
      this._dialogService.informativo(
        'Error',
        'Debe seleccionar horario del curso'
      )
      return;
    }

    this.courseSchedule.forEach(item => {
      schedule.push({
        course_assigned: this.courseSelected.id,
        slot: item.slot.id,
        weekday: item.day
      })
    });

    this._courseService.saveSchedule(schedule)
      .subscribe(
        resp => {
          console.log(resp);
          this._dialogService.openSnackBar(
            'Datos guardados correctamente','Cerrar'
          );
        }
      );

  }

}
