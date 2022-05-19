import { Time } from "@angular/common";
import { Location, PoolSelect } from './location.interface';

export interface Slot {
  id?: number;
  calendar?: number;
  slot?: number;
  starttime: Time;
  endtime: Time;
  lanes?: Lane[];
}

export interface Calendar {
  id?: number;
  location?: number;
  schedule?: number;
  date?: Date | string;
  holiday?: boolean;
  day?: number;
  daytype?: string;
  day_week?: number;
}

export interface SlotDialog {
  day?: Calendar;
  location?: Location;
  pool?: PoolSelect;
  slots?: Slot[];
}

export interface Lane {
  id:      number;
  lane_no: number;
  desc:    null | string;
}
