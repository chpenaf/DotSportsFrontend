import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import * as moment from 'moment';

import { MY_DATE_FORMATS } from '../../../app.component';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { Lane, LocationSelect, PoolSelect } from '../../interfaces/location.interface';
import { CourseService } from '../../services/course.service';
import { Course, FormCourses } from '../../interfaces/courses.interface';
import { CatalogService } from '../../services/catalog.service';
import { Catalog, Course as CourseCatalog, Level } from '../../interfaces/catalog.interface';
import { CourseSchedule } from '../../interfaces/schedule.interface';
import { DialogsService } from '../../components/dialogs.service';
import { ScheduleComponent } from './schedule/schedule.component';

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
  listCourses: FormCourses[] = [];
  listCoursesCatalog: CourseCatalog[] = [];
  listCourseLevels: Level[] = [];
  listPools: PoolSelect[] = [];
  listLanes: Lane[] = [];
  courseSchedule: CourseSchedule[] = [];

  courseSelected: Course = {};

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _catalogService: CatalogService,
    private _courseService: CourseService,
    private _dialogService: DialogsService,
    private _employeeService: EmployeeService,
    private _locationService: LocationService
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

    this.listCourses = [];

    this.courses.clear();

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
                  resp.forEach( item => {
                    this.listCourses.push({
                      id: item.id,
                      pool: typeof item.pool === 'number' ? item.pool : 0,
                      lane: typeof item.lane === 'number' ? item.lane : 0,
                      course: typeof item.course === 'number' ? item.course : 0,
                      level: typeof item.level === 'number' ? item.level : 0,
                      num_sessions: item.num_sessions,
                      teacher: item.teacher,
                      startdate: moment(item.startdate).format('YYYY-MM-DD'),
                      enddate: moment(item.enddate).format('YYYY-MM-DD'),
                      schedule: item.schedule
                    })
                  });

                  this.listCourses.forEach( item => {

                    if( item.course ){

                      this.listCoursesCatalog.forEach( catalog => {
                        if( catalog.id === item.course ){
                          item.listLevels = catalog.levels;
                        }
                      });

                    }

                  });

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

    this.listCourses.forEach( ( item, index ) => {
      this.appendCourseForm(index, item);
    });

  }

  appendCourseForm(index?: number,course?: Course){

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

    this.listCourses.push({
      id: course?.id,
      pool: typeof course?.pool === 'number' ? course.pool : 0,
      lane: typeof course?.lane === 'number' ? course.lane : 0,
      course: typeof course?.course === 'number' ? course.course : 0,
      level: typeof course?.level === 'number' ? course.level : 0,
      num_sessions: course?.num_sessions,
      teacher: course?.teacher,
      startdate: moment(course?.startdate).format('YYYY-MM-DD'),
      enddate: moment(course?.enddate).format('YYYY-MM-DD')
    });

    if( courseForm.controls['pool'].value ){
      this.selectPool(courseForm.controls['pool'].value);
    }

    if( courseForm.controls['course'].value ){
      if( index ){
        this.selectCourse(index,courseForm.controls['course'].value);
      } else {
        this.selectCourse(this.courses.length, courseForm.controls['course'].value);
      }
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

  selectCourse(index: number, id: number){
    this.listCoursesCatalog.forEach( item => {
      if( item.id == id ){
        this.listCourses[index].listLevels = item.levels;
      }
    });

  }

  showSchedule(index: number){

    const idLocation = this.location.value;
    const formCourse = this.courses.at(index) as FormGroup;

    this.courseSelected = formCourse.getRawValue();
    this.courseSelected.location = idLocation;

    if( !this.courseSelected.id ){
      this._dialogService.informativo(
        'Curso no guardado',
        'Para revisar horario debe primero guardar curso'
      )
      return;
    }
    console.log(this.courseSelected)
    const dialogRef = this._dialog.open(
      ScheduleComponent,
      {
        width: '1000px',
        data: {
          course: this.courseSelected,
          list: this.listCourses
        }
      }
    );

    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
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

  }

  deleteCourse(index: number){

    const formCourse = this.courses.at(index) as FormGroup;
    const course: Course = formCourse.getRawValue();

    if( course.id ){
      this._dialogService.dialogToConfirm(
        'Borrar curso',
        '??Est?? seguro que desea borrar el curso?')
        .subscribe(
        result => {
          if(result){
            this._courseService.deleteCourse( course.id! )
              .subscribe(
                resp => {
                  this._dialogService.openSnackBar(
                    'Curso borrado correctamente','Cerrar'
                  );
                  this.courses.removeAt(index);
                }
              );
          } else {
            this._dialogService.openSnackBar(
              'Acci??n canelada por el usuario','Cerrar'
            );
          }
        }
      )
    } else {
      this.courses.removeAt(index);
    }

  }

}
