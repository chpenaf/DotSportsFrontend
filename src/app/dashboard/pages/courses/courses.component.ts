import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { LocationSelect } from '../../interfaces/location.interface';
import { CourseService } from '../../services/course.service';
import { Course } from '../../interfaces/courses.interface';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  listLocations: LocationSelect[] = [];
  listCourses: Course[] = []

  constructor(
    private _fb: FormBuilder,
    private _courseService: CourseService,
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
        resp => this.listLocations = resp
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
    this._courseService.getCourses(idLocation)
      .subscribe(
        resp => {
          this.listCourses = resp;
        }
      );
  }

  fillCoursesForm(courses?: Course[]){
    console.log(courses);
    console.log(courses?.length);
    if(courses?.length){
      const list: Course[] = courses;
      list.forEach( item => {
        this.appendCourseForm(item);
      });
    }
  }

  appendCourseForm(course: Course){

    const courseForm = this._fb.group(
      {
        id: [ course.id ],
        pool: [ course.pool, [ Validators.required ] ],
        lane: [ course.lane, [ Validators.required ] ],
        course: [ course.course, [ Validators.required ] ],
        level: [ course.level, [ ] ],
        num_sessions: [ course.num_sessions, [ Validators.required ] ],
        teacher: [ course.teacher, [ Validators.required ] ],
        startdate: [ course.startdate, [ Validators.required ] ],
        enddate: [ course.enddate, [ Validators.required ] ]
      }
    )

    this.courses.push(courseForm);

  }



}
