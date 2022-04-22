import { LocationSelect, Pool, Lane } from './location.interface';
import { Course as CourseCatalog, Level } from './catalog.interface';

export interface Course {
  id?: number;
  location?: LocationSelect | number;
  pool?: Pool | number;
  lane?: Lane | number;
  course?: CourseCatalog | number;
  level?: Level | number;
  num_sessions?: number;
  teacher?: string;
  startdate?: Date | string;
  enddate?: Date | string;
}
