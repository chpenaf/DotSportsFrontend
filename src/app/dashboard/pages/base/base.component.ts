import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { MembersService } from '../../services/members.service';
import { EmployeeService } from '../../services/employee.service';
import { ApplicationsService } from '../../services/applications.service';
import { App } from '../../interfaces/application.interface';

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
