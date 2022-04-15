import { CreateUser, User } from './user.interface';
import { Location } from './location.interface';

export interface Employee {
  id?: number;
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  sex: string;
  job: string;
  hire_date: Date | null;
  location?: Location;
  user: User;
  is_active: boolean;

}

export interface EmployeeForm {
  title: string;
  create: boolean;
  update: boolean;
  id?: number;
  employee?: Employee;
}

export interface CreateEmployee {
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  job: string;
  hire_date: string;
  id_location: number;
  is_active: string;
  avatar?: File;
  email: string;
  password: string;
}

export interface EditEmployee {
  id: number;
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  job: string;
  hire_date: string;
  id_location: number;
  is_active: string;
  avatar?: File;
  email: string;
  password?: string;
}

export interface CreateEmployeeResponse {
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  sex: string;
  job: string;
  hire_date: Date;
  id_location: number;
  is_active: boolean;
  avatar?: File;
  email: string;
}

export interface ListEmployee {
  id: number;
  avatar?: string;
  doc_num: string;
  full_name: string;
  email: string;
  job_name: string;
  location: string;
  hire_date: Date;
  is_active: boolean;
}

export interface EmployeeResponse {
  ok: boolean;
  message: string;
}
