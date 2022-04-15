import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DpaService } from '../../../../shared/services/dpa.service';
import { Region, Comuna } from '../../../../shared/interfaces/dpa.interface';
import { Location, LocationForm } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location.service';
import { LocationsComponent } from '../locations.component';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit {

  @ViewChild("fileInput", {static:false}) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("image", {static:false}) image!: ElementRef<HTMLImageElement>;

  file!: File;
  imgTmp: any = '';
  url64: any;

  regions: Region[] = [];
  filteredRegionOptions!: Observable<Region[]>;
  regionSelected!: Region;

  comunas: Comuna[] = [];
  filteredComunaOptions!: Observable<Comuna[]>;
  comunaSelected!: Comuna;

  constructor(
    private _fb: FormBuilder,
    private _dpaService: DpaService,
    private _locationService: LocationService,
    public dialogRef: MatDialogRef<LocationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationForm,
  ) {
    this.city.disable();
   }

  get location(){
    return this.data.location;
  }

  locationForm: FormGroup = this._fb.group(
    {
      name: [ this.location?.name, [ Validators.required ] ],
      address: [ this.location?.address, [ Validators.required ] ],
      region: [ , [ Validators.required ] ],
      city: [ , [ Validators.required ] ],
      phone: [ this.location?.phone, [ Validators.required ] ],
      image: [ , [ ] ]
    }
  );

  get name() {
    return this.locationForm.controls['name'];
  }

  get address() {
    return this.locationForm.controls['address'];
  }

  get region() {
    return this.locationForm.controls['region'];
  }

  get city() {
    return this.locationForm.controls['city'];
  }

  get phone() {
    return this.locationForm.controls['phone'];
  }

  ngOnInit(): void {

    this._dpaService.getRegions()
      .subscribe(
        data => {
          this.regions = data;
          this.filteredRegionOptions = this.region.valueChanges.pipe(
            startWith(''),
            map(value => ( typeof value === 'string' ? value : value.nombre ) ),
            map(nombre => ( nombre ? this._filterRegion(nombre): this.regions.slice() ) )
          )
        }
      )

    if(this.location?.region && this.location.city){
      const region: Region = {
        codigo: this.location.id_region,
        nombre: this.location?.region
      }
      const comuna: Comuna = {
        codigo: this.location.id_city,
        nombre: this.location.city
      }
      this.regionChange(region);
      this.comunaChange(comuna);
    }
  }

  displayRegion(region: Region): string {
    return region && region.nombre ? region.nombre : '';
  }

  displayComuna(comuna: Comuna): string {
    return comuna && comuna.nombre ? comuna.nombre : '';
  }

  private _filterRegion(nombre: string): Region[] {
    const filterValue = nombre.toLowerCase();
    return this.regions.filter(
      option => option.nombre.toLowerCase().includes(filterValue) );
  }

  private _filterComuna(nombre: string): Region[] {
    const filterValue = nombre.toLowerCase();
    return this.comunas.filter(
      option => option.nombre.toLowerCase().includes(filterValue) );
  }

  regionChange(selected: Region){
    this.region.setValue(selected);
    this.comunas = [];
    this.city.setValue('');
    this.city.disable();
    this.city.markAsUntouched();
    this.regionSelected = selected;
    this._dpaService.getComunas(selected.codigo)
      .subscribe(
        resp => {
          this.comunas = resp;
          this.city.enable();
          this.filteredComunaOptions = this.city.valueChanges.pipe(
            startWith(''),
            map(value => ( typeof value === 'string' ? value : value.nombre ) ),
            map(nombre => ( nombre ? this._filterComuna(nombre): this.comunas.slice() ) )
          )
        }
      )
  }

  comunaChange(selected: Comuna){
    this.city.setValue(selected);
    this.comunaSelected = selected;
  }

  clearRegion(){
    this.region.setValue('')
    this.region.markAsUntouched();
    this.city.setValue('');
    this.city.disable();
    this.city.markAsUntouched();
    this.comunas = [];
  }

  browseImage() {
    const fileInput = this.fileInput.nativeElement;

    fileInput.onchange = () => {
      const file = fileInput.files?.item(0);
      const filename: string = file?.name || '';
      this.locationForm.controls['image'].setValue(filename);
    }

    fileInput.click();

  }

  onFileChange(event:any){
    const file: File = event.target?.files?.[0];
    const reader = new FileReader();

    if (!file){
      this.imgTmp = null;
      return;
    }

    this.file = file;

    reader.readAsDataURL( this.file );
    reader.onloadend = () => {
      this.imgTmp = reader.result;
    }
  }

  change( ev:any ) {
    console.log(ev);
  }

  submit(){

    if ( this.locationForm.invalid ){
      this.locationForm.markAllAsTouched();
      return;
    }

    const location: Location = {
      name: this.name.value,
      address: this.address.value,
      id_region: this.regionSelected.codigo,
      region: this.regionSelected.nombre,
      id_city: this.comunaSelected.codigo,
      city: this.comunaSelected.nombre,
      phone: this.phone.value,
      image: this.file
    }

    if (this.data.create) {
      this._locationService.createLocation( location )
        .subscribe(
          resp => {
            return true;
          }
        )
    }

    if (this.data.update){

      this._locationService.updateLocation( location, this.location?.id! )
        .subscribe(
          resp => {
            return true;
          }
        )
    }
  }

}
