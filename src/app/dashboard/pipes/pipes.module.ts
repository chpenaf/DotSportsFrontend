import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarPipe } from './avatar.pipe';
import { FilenamePipe } from './filename.pipe';
import { TimePipe } from './time.pipe';



@NgModule({
  declarations: [
    AvatarPipe,
    FilenamePipe,
    TimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AvatarPipe,
    FilenamePipe,
    TimePipe
  ]
})
export class PipesModule { }
