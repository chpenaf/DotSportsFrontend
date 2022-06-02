import { LocationSelect, Pool, Lane, PoolSelect } from './location.interface';
import { Course as CourseCatalog, Level } from './catalog.interface';
import { Slot } from './schedule.interface';

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
  schedule?: Schedule[];
}

export interface Schedule {
  id?: number;
  course_assigned?: number;
  slot?: number | Slot;
  weekday?: number;
}

export interface DialogSchedule {
  course: Course;
  list: Course[];
}

export interface CourseSession {
  id?: number;
  date?: number;
  slot?: number;
  desc?: string;
}

export interface FormCourses {
  id?: number;
  pool?: number;
  lane?: number;
  course?: number;
  level?: number;
  num_sessions?: number;
  teacher?: string;
  startdate?: string;
  enddate?: string;
  listPools?: PoolSelect[];
  listLanes?: Lane[];
  listCourses?: Course[];
  listLevels?: Level[];
  schedule?: Schedule[];
}
