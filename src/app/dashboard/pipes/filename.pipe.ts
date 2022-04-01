import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  transform( path: string ): string {
    return path.replace(/^.*[\\\/]/, '')
  }

}
