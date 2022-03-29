import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  transform( user: User ): string {
    if( user.avatar ){
      return user.avatar;
    } else {
      return '/assets/img/avatardefault_92824.png';
    }

  }

}
