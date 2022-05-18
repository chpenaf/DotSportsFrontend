import { Time } from "@angular/common";
import { PoolSelect } from './location.interface';

export interface Slot {
  id?: number;
  calendar?: number;
  slot?: number;
  starttime: Time;
  endtime: Time;
  desc?: string;
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
  pool?: PoolSelect;
  slots?: Slot[];
}
