import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { tap } from 'rxjs/operators';

import { CreditHeader } from '../../../dashboard/interfaces/credits.interface';
import { CreditsService } from '../../../dashboard/services/credits.service';
import { Member } from '../../../dashboard/interfaces/member.interface';
import { MembersService } from '../../../dashboard/services/members.service';

@Component({
  selector: 'app-my-credits',
  templateUrl: './my-credits.component.html',
  styleUrls: ['./my-credits.component.css']
})
export class MyCreditsComponent implements OnInit {

  constructor(
    private _location: Location,
    private _creditService: CreditsService,
    private _memberService: MembersService
  ) { }

  myInfo: Member = this._memberService.myInfo;
  credits: CreditHeader[] = [];

  ngOnInit(): void {
    this._memberService.selfInfo()
      .pipe(
        tap(
          resp => this.getCredits(resp.id)
        )
      )
      .subscribe(
        resp => this.myInfo = resp
      );
  }

  getCredits(id: number) {
    this._creditService.getCredits(id)
      .subscribe(
        resp => this.credits = resp
      );
  }

  back() {
    this._location.back();
  }

}
