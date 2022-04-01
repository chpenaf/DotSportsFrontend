import { User } from './user.interface';
import { Location } from './location.interface';

export interface Employee {
  id?: number;
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  sex: string;
  job: string;
  hire_date: Date;
  location?: Location;
  user: User;
  is_active: boolean;

}

export interface EmployeeForm {
  title: string;
  create: boolean;
  update: boolean;
  employee?: Employee;
}
