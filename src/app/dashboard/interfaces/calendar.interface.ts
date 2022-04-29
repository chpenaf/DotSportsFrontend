import { Time } from "@angular/common";

export interface Slot {
  id?: number;
  calendar?: number;
  slot?: number;
  starttime: Time;
  endtime: Time;
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
