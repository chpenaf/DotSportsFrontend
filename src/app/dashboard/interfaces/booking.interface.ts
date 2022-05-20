import { Slot } from "./calendar.interface";
import { CreditPos } from './credits.interface';

export interface Booking {
  id?: number;
  member?: number;
  calendar?: number;
  slot?: number | Slot;
  location?: number;
  pool?: number;
  credit_header?: number;
  credit_pos?: number | CreditPos;
}

export interface BookingDialog {
  title: string,
  member?: number;
  bookings?: Booking[];
}
