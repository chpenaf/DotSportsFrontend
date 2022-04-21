import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DialogToConfirmComponent } from '../../../../components/dialog-to-confirm/dialog-to-confirm.component';
import { ListMembers } from '../../../../interfaces/member.interface';
import { MembersService } from '../../../../services/members.service';
import { FormComponent } from '../form/form.component';
import { CreditsComponent } from '../../../../components/credits/credits.component';
import { CreditsService } from '../../../../services/credits.service';

@Component({
  selector: 'app-list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.css']
})
export class ListMembersComponent implements AfterViewInit {

  displayedColumns: string[] = [
    'avatar',
    'doc_num',
    'full_name',
    'age',
    'email',
    'status',
    'credits',
    'edit',
    'cancel'
  ]

  dataSource: MatTableDataSource<ListMembers> = new MatTableDataSource();
  listMembers: ListMembers[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _creditService: CreditsService,
    private _memberService: MembersService

    ) {
    this.fillList();
  }

  fillList(){
    this._memberService.list()
      .subscribe(
        resp => {
          this.listMembers = resp;
          this.dataSource.data = resp;
        }
      )
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(){

    const dialogRef = this._dialog.open(FormComponent,
      {
        data: {
          title: 'Crear Miembro',
          create: true,
          update: false
        }
      });

    dialogRef.afterClosed().subscribe(
      result => {
        if ( result ){
          this.openSnackBar('Miembro creado correctamente','Cerrar');
          this.fillList();
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );

  }

  credits( member: ListMembers ){

    if(!member.id){
      return;
    }

    const dialogRef = this._dialog.open(CreditsComponent,{
      width: '800px',
      data: {
        title: 'Titulo',
        location: '1',
        member: member
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        result => {
          this._creditService.getQuantCredits( member.id! );
          return result;
        }
      )

  }

  update( id: number ){

    this._memberService.retrieve(id)
      .subscribe(
        resp => {
          const dialogRef = this._dialog.open(FormComponent,
            {
              data: {
                title: 'Editar Miembro',
                create: false,
                update: true,
                member: resp,
                id: id
              }
            });

          dialogRef.afterClosed().subscribe(
            result => {
              if ( result ){
                this.openSnackBar('Miembro actualizado correctamente','Cerrar');
                this.fillList();
              } else {
                this.openSnackBar('Acción cancelada','Cerrar');
              }
            }
          );
        }
      )


  }

  cancel( id: number ){
    const dialogRef = this._dialog.open(
      DialogToConfirmComponent, {
        data: {
          title: 'Anular Miembro',
          message: `¿Está seguro de anular el miembro?`,
          id: id,
          cancel: {
            text: 'Cancelar'
          },
          confirm: {
            text: 'Confirmar',
            color: 'warn'
          }
        }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if ( result ){
          this._memberService.cancel( id )
            .subscribe(
              resp => {
                this.openSnackBar('Miembro desactivado','Cerrar');
                this.fillList();
              }
            )
        } else {
          this.openSnackBar('Acción cancelada','Cerrar');
        }
      }
    );
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message,action,
      {
        duration: 3000,
      })
  }

}
