import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { App } from '../../../dashboard/interfaces/application.interface';
import { User } from '../../../dashboard/interfaces/user.interface';
import { ApplicationsService } from '../../../dashboard/services/applications.service';
import { AuthService } from '../../../auth/services/auth.service';
import { EmployeeService } from '../../../dashboard/services/employee.service';
import { MembersService } from '../../../dashboard/services/members.service';
import { UserService } from '../../../dashboard/services/user.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  hide: boolean = true;

  screenHeight: any;
  screenWidth: any;

  @HostListener('window:resize',['$event'])
  onWindowsResize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth  = window.innerWidth;
  }

  apps: App[] = [];

  current: User = {
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    is_staff: false
  };

  get sizeScreen(): string {
    if( this.screenWidth < 600 ) {
      return 'SM';
    } else {
      return 'PC';
    }
  }

  constructor(
    private _router: Router,
    private _applicationsService: ApplicationsService,
    private _authService: AuthService,
    private _employeeService: EmployeeService,
    private _memberService: MembersService,
    private _userService: UserService
  ) {
    this.onWindowsResize();
    this._userService.getCurretUser()
      .subscribe(
        resp => {
          this.current = resp;
        }
      );
    this._applicationsService.getApps()
      .subscribe(
        resp => {
          this.apps = resp;
        }
      )
   }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth  = window.innerWidth;
  }

  signout(){
    this._authService.signout();
    console.log('saliendo...');
    this._router.navigate(['/auth/login/']);
  }

}
