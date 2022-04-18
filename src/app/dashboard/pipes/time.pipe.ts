import { Time } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform( time: Time ): string {
    const oneTime = moment(time,'HH:mm:ss')
    const hours = oneTime.format('HH');
    const minutes = oneTime.format('mm')
    return `${ hours }:${ minutes }`;
  }

}
