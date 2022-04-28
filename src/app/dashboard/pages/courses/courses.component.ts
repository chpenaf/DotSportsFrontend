import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { tap } from 'rxjs/operators';

import { MY_DATE_FORMATS } from '../../../app.component';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { Lane, LocationSelect, PoolSelect } from '../../interfaces/location.interface';
import { CourseService } from '../../services/course.service';
import { Course, Schedule } from '../../interfaces/courses.interface';
import { CatalogService } from '../../services/catalog.service';
import { Catalog, Course as CourseCatalog, Level } from '../../interfaces/catalog.interface';
import { ScheduleService } from '../../services/schedule.service';
import { Slot, WeekSchedule, CourseSchedule } from '../../interfaces/schedule.interface';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { DialogsService } from '../../components/dialogs.service';
import * as moment from 'moment';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class CoursesComponent implements OnInit {

  catalog: Catalog = {};
  listLocations: LocationSelect[] = [];
  listCourses: Course[] = [];
  listCoursesCatalog: CourseCatalog[] = [];
  listCourseLevels: Level[] = [];
  listPools: PoolSelect[] = [];
  listLanes: Lane[] = [];
  weekSchedule: WeekSchedule[] = [];
  courseSchedule: CourseSchedule[] = [];

  courseSelected: Course = {};

  constructor(
    private _fb: FormBuilder,
    private _catalogService: CatalogService,
    private _courseService: CourseService,
    private _dialogService: DialogsService,
    private _employeeService: EmployeeService,
    private _locationService: LocationService,
    private _scheduleService: ScheduleService
  ) { }

  searchForm = this._fb.group(
    {
      location: [ , Validators.required ]
    }
  );

  coursesForm = this._fb.group(
    {
      courses: this._fb.array([])
    }
  )

  ngOnInit(): void {

    this._locationService.getLocationToSelect()
      .subscribe(
        resp => {
          this.listLocations = resp;
        }
      )

    this._employeeService.getLogged()
      .subscribe(
        resp => this.location.setValue(resp.location?.id)
      )

  }

  get location(){
    return this.searchForm.controls['location'];
  }

  get courses(){
    return this.coursesForm.controls['courses'] as FormArray;
  }

  searchCourses(){
    if(this.searchForm.invalid){
      this.searchForm.markAllAsTouched();
      return;
    }
    const idLocation = this.location.value;

    this._catalogService.getCatalog(idLocation)
      .pipe(
        tap(
          data => {
            this._courseService.getCourses(idLocation)
              .subscribe(
                resp => {
                  this.listCourses = resp;
                  this.fillCoursesForm();
                });
          }
        )
      )
      .subscribe(
        resp => {
          this.catalog = resp;
          if(this.catalog.location?.pools?.length){
            this.listPools = this.catalog.location.pools;
          }

          if(this.catalog.courses?.length){
            this.listCoursesCatalog = this.catalog.courses;
          }
        }
      );
  }

  fillCoursesForm(){

    if( !this.listCourses.length ){
      return;
    }

    this.listCourses.forEach(item => {
      this.appendCourseForm(item);
    });

  }

  appendCourseForm(course?: Course){

    const courseForm = this._fb.group(
      {
        id: [ course?.id ],
        pool: [ course?.pool, [ Validators.required ] ],
        lane: [ course?.lane, [ Validators.required ] ],
        course: [ course?.course, [ Validators.required ] ],
        level: [ course?.level, [ ] ],
        num_sessions: [ course?.num_sessions, [ Validators.required ] ],
        teacher: [ course?.teacher, [ Validators.required ] ],
        startdate: [ course?.startdate, [ Validators.required ] ],
        enddate: [ course?.enddate, [ ] ]
      }
    );

    if( courseForm.controls['pool'].value ){
      this.selectPool(courseForm.controls['pool'].value);
    }

    if( courseForm.controls['course'].value ){
      this.selectCourse(courseForm.controls['course'].value);
    }

    courseForm.controls['id'].disable();

    this.courses.push(courseForm);

  }

  selectPool(id: number){
    this.listPools.forEach(pool => {
      if(pool.id == id){
        this.listLanes = pool.lanes!;
      }
    })
  }

  selectCourse(id: number){
    this.listCoursesCatalog.forEach( item => {
      if( item.id == id ){
        this.listCourseLevels = item.levels;
      }
    });

  }

  showSchedule(index: number){
    const idLocation = this.location.value;

    const formCourse = this.courses.at(index) as FormGroup;

    this.courseSelected = formCourse.getRawValue();

    if( !this.courseSelected.id ){
      this._dialogService.informativo(
        'Curso no guardado',
        'Para revisar horario debe primero guardar curso'
      )
      return;
    }

    this._scheduleService.getWeekSchedule(idLocation)
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
          console.log(week);
        }
      )
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

  saveCourse(){

    if( this.coursesForm.invalid ){
      this.coursesForm.markAllAsTouched();
      this._dialogService.openSnackBar(
        'Formulario con errores','Cerrar'
      );
      return;
    }

    const courses: Course[] = [];

    this.courses.controls.forEach( item => {
      const courseForm = item as FormGroup;
      const course: Course = courseForm.getRawValue();
      courses.push(course);
    });

    courses.forEach( (course, index) => {

      course.location = this.location.value;

      if( !course.id ){
        course.startdate = moment(course.startdate).format('YYYY-MM-DD');
        this._courseService.saveCourse(course)
          .subscribe(
            resp => {
              const form = this.courses.at(index) as FormGroup;
              form.controls['id'].setValue(resp.id);
              this._dialogService.openSnackBar(
                'Datos guardados correctamente','Cerrar'
              );
            }
          );
      } else {
        const old: Course = this.listCourses[index];
        if( ( old.location != course.location ) ||
            ( old.pool != course.pool ) ||
            ( old.lane != course.lane ) ||
            ( old.course != course.course ) ||
            ( old.level != course.level ) ||
            ( old.num_sessions != course.num_sessions ) ||
            ( old.teacher != course.teacher ) ||
            ( old.startdate != course.startdate )
         ){
          this._courseService.updateCourse(course.id, course)
            .subscribe(
              resp => {
                this._dialogService.openSnackBar(
                  'Datos guardados correctamente','Cerrar'
                );
              }
            );
         }
      }

    });

      this._dialogService.openSnackBar('No se detectaron cambios','Cerrar');

  }

}
