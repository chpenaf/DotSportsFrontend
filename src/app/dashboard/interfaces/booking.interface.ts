import { Slot } from "./calendar.interface";
import { CreditPos } from './credits.interface';

export interface Booking {
  id?: number;
  member?: number;
  calendar?: number;
  slot?: number | Slot;
  location?: number | string;
  pool?: number | string;
  credit_header?: number;
  credit_pos?: number | CreditPos;
  old?: boolean;
}

export interface BookingDialog {
  title: string,
  member?: number;
  bookings?: Booking[];
}
