import { LocationSelect as Location } from '../interfaces/location.interface';

export interface Catalog {
  location?: Location;
  services?: Service[];
  courses?:  Course[];
}

export interface Course {
  id:     number;
  name:   string;
  levels: Level[];
}

export interface Level {
  id:       number;
  course?:  number;
  name:     string;
  level:    number;
  service?: number;
}

export interface Service {
  id:            number;
  name:          string;
  subcategories: Level[];
}
