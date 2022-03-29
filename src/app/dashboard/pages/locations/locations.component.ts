import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateFormComponent } from './create-form/create-form.component';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  locations: Location[] = [];

  constructor(
    private _dialog: MatDialog,
    private _locationService: LocationService
  ) { }

  ngOnInit(): void {
    this._locationService.getLocations()
      .subscribe(
        resp => {
          this.locations = resp.results;
          console.log(this.locations);
        }
      )

  }

  openCreateLocationDialog() {
    const dialogRef = this._dialog.open(CreateFormComponent);

    dialogRef.afterClosed().subscribe(
      result => {
        console.log(`Dialog result: ${ result }`)
      }
    );

  }

}
