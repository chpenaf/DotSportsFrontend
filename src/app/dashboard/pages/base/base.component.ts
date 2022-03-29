import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

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

  apps = [
    {
      path: './',
      name: 'home',
      icon: 'home',
      text: 'Home',
    },
    {
      path: './locations',
      name: 'location',
      icon: 'business',
      text: 'Sedes'
    },
    {
      path: './employees',
      name: 'employees',
      icon: 'group',
      text: 'Empleados'
    },
    {
      path: './members',
      name: 'members',
      icon: 'group',
      text: 'Miembros',
    }
  ]

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
    private _authService: AuthService,
    private _userService: UserService
  ) {
    this.onWindowsResize();
   }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth  = window.innerWidth;

     this._userService.getCurretUser()
       .subscribe(
         resp => this.current = resp
       );
  }

  signout(){
    this._authService.signout();
    console.log('saliendo...');
    this._router.navigate(['/auth/login/']);
  }

}
