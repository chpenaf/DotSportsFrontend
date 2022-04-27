import { Time } from '@angular/common';
import { LocationSelect } from './location.interface';

export interface Schedule {
  id?: number;
  location: LocationSelect;
  begin_validity?: Date | string;
  end_validity?: Date | string;
  days: DayType[];
}

export interface DayType {
  id?: number;
  schedule?: number;
  daytype: string;
  desc: string;
  is_open: boolean;
  slots: Slot[];
}

export interface DayTypeKey {
  schedule: number,
  daytype: string
}

export interface Slot {
  id?: number;
  schedule_day?: number;
  slot?: number;
  starttime?: Time;
  endtime?: Time;
}

export interface ScheduleResponse {
  id?: number;
  location?: LocationSelect;
  begin_validity?: Date | string;
  end_validity?: Date | string;
  days: DayType[];
}

export interface WeekSchedule {
  monday?: Slot;
  tuesday?: Slot;
  wednesday?: Slot;
  thursday?: Slot;
  friday?: Slot;
  saturday?: Slot;
}

export interface CourseSchedule {
  day: number;
  slot: Slot;
}
