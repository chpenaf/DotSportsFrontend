import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { tap } from 'rxjs/operators';

import { MY_DATE_FORMATS } from '../../../../app.component';
import { FormCapacityPool, CapacityPool } from '../../../interfaces/config.interface';
import { LocationService } from '../../../services/location.service';
import { LocationSelect, PoolSelect } from '../../../interfaces/location.interface';
import { EmployeeService } from '../../../services/employee.service';
import { ConfigService } from '../../../services/config.service';
import * as moment from 'moment';

@Component({
  selector: 'app-capacity-form',
  templateUrl: './capacity-form.component.html',
  styleUrls: ['./capacity-form.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    }
  ]
})
export class CapacityFormComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _configService: ConfigService,
    private _employeeService: EmployeeService,
    private _locationService: LocationService,
    public dialogRef: MatDialogRef<CapacityFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormCapacityPool
  ) { }

  listLocations: LocationSelect[] = [];
  listPools: PoolSelect[] = [];

  form = this._fb.group(
    {
      id: [ this.data.data?.id, [] ],
      location: [ this.data.data?.location, [ Validators.required ] ],
      pool: [ this.data.data?.pool, [ Validators.required ] ],
      capacity_lane: [ this.data.data?.capacity_lane, [ Validators.required ] ],
      begin_validity: [ this.data.data?.begin_validity, [ Validators.required ] ],
      end_validity: [ this.data.data?.end_validity, [ Validators.required ] ]
    }
  );

  get id(){
    return this.form.controls['id'];
  }

  get location(){
    return this.form.controls['location'];
  }

  get pool(){
    return this.form.controls['pool'];
  }

  get capacity_lane(){
    return this.form.controls['capacity_lane'];
  }

  get begin_validity(){
    return this.form.controls['begin_validity'];
  }

  get end_validity(){
    return this.form.controls['end_validity'];
  }

  ngOnInit(): void {

    this.id.disable();

    this._locationService.getLocationToSelect()
      .pipe(
        tap( resp => {
          if( this.location.value ){
            resp.forEach( item => {
              if( item.id == this.location.value ){
                if( item.pools ){
                  this.listPools = item.pools;
                }
              }
            });
          }
        })
      )
      .subscribe(
        resp => {
          this.listLocations = resp;
        }
      );

    if( !this.data.data?.id ){

      this._employeeService.getLogged()
        .subscribe(
          resp => {
            if( resp?.location?.id ){
              this.location.setValue(resp.location.id);
            }
          }
        );
        this.capacity_lane.setValue(10);
        this.begin_validity.setValue(new Date());
    }

  }

  save(){

    if( this.form.invalid ){
      this.form.markAllAsTouched();
      return;
    }

    const capacity: CapacityPool = this.form.getRawValue();
    capacity.begin_validity = moment(capacity.begin_validity).format('YYYY-MM-DD');
    capacity.end_validity = moment(capacity.end_validity).format('YYYY-MM-DD');

    if( capacity.id ){
      // Update

      this._configService.putCapacityPool(capacity)
        .subscribe(
          resp => {
            this.dialogRef.close(true);
          }
        );

    } else {
      // Create

      this._configService.createCapacityPool(capacity)
        .subscribe(
          resp => {
            this.dialogRef.close(true);
          }
        );

    }

  }

}
