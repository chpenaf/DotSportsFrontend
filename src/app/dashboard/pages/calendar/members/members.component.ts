import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SlotMemberDialog } from '../../../interfaces/calendar.interface';
import { Member } from '../../../interfaces/member.interface';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'doc_num', 'name', 'email'];
  dataSource: MatTableDataSource<Member> = new MatTableDataSource();

  constructor(
    public dialogRef: MatDialogRef<MembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlotMemberDialog,
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this.data.members;
    console.log(this.dataSource.data)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
