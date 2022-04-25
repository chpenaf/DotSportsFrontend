import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { tap } from 'rxjs/operators';

import { MY_DATE_FORMATS } from '../../../app.component';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { Lane, LocationSelect, PoolSelect } from '../../interfaces/location.interface';
import { CourseService } from '../../services/course.service';
import { Course } from '../../interfaces/courses.interface';
import { CatalogService } from '../../services/catalog.service';
import { Catalog, Course as CourseCatalog, Level } from '../../interfaces/catalog.interface';
import { ScheduleService } from '../../services/schedule.service';
import { WeekSchedule } from '../../interfaces/schedule.interface';

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
  weekSchedule: WeekSchedule[] = []

  constructor(
    private _fb: FormBuilder,
    private _catalogService: CatalogService,
    private _courseService: CourseService,
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
        enddate: [ course?.enddate, [ Validators.required ] ]
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
        }
      )
  }



}
