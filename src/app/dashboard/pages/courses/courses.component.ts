import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { LocationSelect } from '../../interfaces/location.interface';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  listLocations: LocationSelect[] = [];

  constructor(
    private _fb: FormBuilder,
    private _employeeService: EmployeeService,
    private _locationService: LocationService
  ) { }

  searchForm = this._fb.group(
    {
      location: [ , Validators.required ]
    }
  );

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

}
