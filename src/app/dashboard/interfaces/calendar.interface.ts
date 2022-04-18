import { Time } from "@angular/common";

export interface Slot {
  id?: number;
  calendar?: number;
  slot?: number;
  starttime: Time;
  endtime: Time;
}
