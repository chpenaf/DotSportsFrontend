import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

import { Catalog, Course, Level, Service } from '../../interfaces/catalog.interface';
import { LocationSelect as Location } from '../../interfaces/location.interface';
import { CatalogService } from '../../services/catalog.service';
import { EmployeeService } from '../../services/employee.service';
import { LocationService } from '../../services/location.service';
import { DialogsService } from '../../components/dialogs.service';
import { DialogForm } from '../../interfaces/dialog.interface';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  catalog: Catalog = this._catalogService.catalog;
  locations: Location[] = [];

  constructor(
    private _fb: FormBuilder,
    private _catalogService: CatalogService,
    private _dialogService: DialogsService,
    private _locationService: LocationService,
    private _employeeService: EmployeeService
  ) { }

  ngOnInit(): void {

    this.getCatalog()

    this._locationService.getLocationToSelect()
        .subscribe(
          resp => {
            this.locations = resp;
          }
        )
  }

  formCatalog = this._fb.group(
    {
      location: [ , [ Validators.required ] ],
      services: this._fb.array([]),
      courses: this._fb.array([])
    }
  )

  get location(){
    return this.formCatalog.controls['location'];
  }

  get services(){
    return this.formCatalog.controls['services'] as FormArray;
  }

  get courses(){
    return this.formCatalog.controls['courses'] as FormArray;
  }

  getCatalog(){
    this._employeeService.getLogged()
      .subscribe(

        resp => {
          if( resp.location?.id ){
            this._catalogService.getCatalog( resp.location?.id )
              .subscribe(
                resp => {
                  this.catalog = resp;
                  this.fillFormCatalog();
                });
          }
        });
  }

  fillFormCatalog(){

    if( this.catalog.location?.id){
      this.location.setValue(this.catalog.location.id)
    }

    // if( this.catalog.services ){
    //   this.catalog.services = [];
    // }

    // if( this.catalog.courses ){
    //   this.catalog.courses = [];
    // }

    this.catalog.services?.forEach( service => {
      this.addServiceForm(service);
    });

    this.catalog.courses?.forEach( course  => {
      this.addCourseForm(course);
    });

  }

  getServiceForm( index: number ){
    return this.services.at( index ) as FormGroup;
  }

  getCourseForm( index: number ){
    return this.courses.at( index ) as FormGroup;
  }

  getSubcategories( index: number ){
    return this.getServiceForm( index ).controls['subcategories'] as FormArray;
  }

  getSubcategories2( form: FormGroup ){
    return form.controls['subcategories'] as FormArray;
  }

  getLevels( index: number ){
    return this.getCourseForm( index ).controls['levels'] as FormArray;
  }

  getSubcategoriesControls( serviceForm: any ){
    const form = serviceForm as FormGroup;
    return ( form.controls['subcategories'] as FormArray ).controls
  }

  getLevelsControls( courseForm: any ){
    const form = courseForm as FormGroup;
    return ( form.controls['levels'] as FormArray ).controls
  }

  addServiceForm(service?: Service){
    const serviceForm  = this._fb.group(
      {
        id: [ service?.id, [ ] ],
        name: [ service?.name, [ Validators.required ] ],
        subcategories: this._fb.array([])
      }
    );

    service?.subcategories.forEach( level => {
      this.getSubcategories2(serviceForm).push(
        this.buildServiceSubcategoryForm(level)
      )
    });

    this.services.push(serviceForm);
  }

  buildServiceSubcategoryForm(level?: Level){
    const subcategoryForm: FormGroup = this._fb.group(
      {
        id: [ level?.id, [] ],
        level: [ level?.level, [ Validators.required ] ],
        name: [ level?.name, [ Validators.required ] ]
      }
    );
    return subcategoryForm;
  }

  addServiceSubcategoryForm(index: number){
    this.getSubcategories(index).push(
      this.buildServiceSubcategoryForm()
    );
  }

  addCourseForm(course?: Course){
    const courseForm  = this._fb.group(
      {
        id: [ course?.id, [ ] ],
        name: [ course?.name, [ Validators.required ] ],
        levels: this._fb.array([])
      }
    );

    course?.levels.forEach( level => {
      ( courseForm.controls['levels'] as FormArray )
        .push(this.addCourseLevelForm(level));
    });

    this.courses.push(courseForm);
  }

  addCourseLevelForm(level?: Level){
    const levelForm: FormGroup = this._fb.group(
      {
        id: [ level?.id, [] ],
        level: [ level?.level, [] ],
        name: [ level?.name, [] ]
      }
    );
    return levelForm;
  }

  getServiceTitle(index: number){
    return this.getServiceForm(index).controls['name'].value
  }

  getCourseTitle(index: number){
    return this.getCourseForm(index).controls['name'].value
  }

  deleteSubcategory(index: number, subindex: number){

    const subcategoryForm = this.getSubcategories(index)
                              .at(subindex) as FormGroup;

    const subcategory: Level = subcategoryForm.value

    if( !subcategory.id ){
      this.getSubcategories(index).removeAt(subindex);
      return;
    }

    this._dialogService.dialogToConfirm(
      'Eliminar subcategoría',
      '¿Desea eliminar la subcategoría seleccionada?')
      .subscribe(
        result => {
          if ( result ){
            this._catalogService.deleteSubcategory(subcategory)
              .subscribe(
                resp => {
                  this.getSubcategories(index).removeAt(subindex);
                  this._dialogService.openSnackBar(
                    'Subcategoría borrada correctamente','Cerrar');
                });
          } else {
            this._dialogService.openSnackBar(
              'Acción cancelada','Cerrar');
          }
        }
      );
  }

  addCourseDialog(){

    const dialog: DialogForm = {
      title: 'Agregar curso',
      input1: {
        label: 'Nombre curso',
        input: 'courseName',
        value: ''
      }
    }

    this._dialogService.dialogForm(dialog)
      .subscribe(
        result => {
          if( result ){
            const input = dialog.input1;
            if( input.value ){
              this._catalogService.createCourse({
                name: input.value
              }).subscribe({
                next: resp => {
                  this._dialogService.openSnackBar('Curso guardado correctamente','Cerrar');
                  this.getCatalog();
                },
                error: err => {
                  this._dialogService.openSnackBar('Ha ocurrido un error mientras se guardaba','Cerrar');
                }
              });
            }
          } else {
            this._dialogService.openSnackBar('Acción cancelada','Cerrar');
          }
        }
    );

  }

}
