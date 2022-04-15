import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { moveItemInFormArray } from '../../../shared/functions/utils.functions'
import { App } from '../../interfaces/application.interface'
import { ApplicationsService } from '../../services/applications.service';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  listApps: App[] = []

  constructor(
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _appService: ApplicationsService,
    ) { }

  appsForm = this._fb.group(
    {
      apps: this._fb.array([])
    }
  );

  get apps(){
    return this.appsForm.controls['apps'] as FormArray;
  }

  icon(par:AbstractControl){
    return par.value.icon;
  }

  fillAppsForm(){
    for (let app of this.listApps) {
      const appForm = this._fb.group({
        id: [ app.id ],
        position: [ app.position ],
        name: [ app.name, Validators.required ],
        path: [ app.path, Validators.required ],
        text: [ app.text, Validators.required ],
        icon: [ app.icon, Validators.required ],
        admin: [ app.admin, Validators.required ],
        staff: [ app.staff, Validators.required ],
        member: [ app.member, Validators.required ],
      })
      this.apps.push(appForm);
    }
  }

  addApp(){
    const position = this.apps.length + 1;

    const appForm = this._fb.group({
      id: [ ],
      position: [ position ],
      name: [ , Validators.required ],
      path: [ , Validators.required ],
      text: [ , Validators.required ],
      icon: [],
      admin: [],
      staff: [],
      member: [],
    })

    this.apps.push(appForm);
  }

  deleteApp(index: number){
    const id = this.apps.at(index).value['id'];

    if(id){
      this._appService.delete(id).subscribe(
        resp => this.apps.removeAt(index)
      );
    } else {
      this.apps.removeAt(index);
    }
    this.openSnackBar('Aplicación borrada','Cerrar')

  }

  ngOnInit(): void {
    this._appService.getApps()
      .subscribe(
        resp => {
          this.listApps = resp;
          this.fillAppsForm();
        }
      );
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(
      this.apps,
      event.previousIndex,
      event.currentIndex
    );

    moveItemInArray(
      this.listApps,
      event.previousIndex,
      event.currentIndex
    )

    this.listApps.forEach((app, idx) => {
      app.position = idx + 1;
    });

    for(let i = 0; i < this.apps.length; i++ ){
      const current: FormGroup = this.apps.at(i) as FormGroup;
      current.controls['position'].setValue(i + 1);
    }

  }

  save(){

    if( this.appsForm.invalid){
      this.appsForm.markAllAsTouched();
      return;
    }

    this.listApps = this.apps.value;

    this._appService.saveApps(this.listApps)
      .subscribe(
        resp => {
          this.openSnackBar('Cambios aplicados','Cerrar')
        }
      );

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500
    });
  }

}
