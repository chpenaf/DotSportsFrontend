import { Component, OnInit } from '@angular/core';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  current: User = {
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    is_staff: false
  };

  constructor(
    private _userService: UserService
  ) {
    if ( this._userService.Current ){
      this._userService.getCurretUser()
        .subscribe(
          resp => {
            this.current = resp;
          }
        );
    } else {
      this.current = this._userService.Current;
    }
   }

  ngOnInit(): void {
  }

  changeProfile() {

  }

  cambiarFoto(){

  }

}
