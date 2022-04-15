import { User } from "./user.interface";

export interface DialogMember {
  title: string;
  create: boolean;
  update: boolean;
  id?: number;
  member?: Member
}

export interface ListMembers {
  id?: number;
  avatar?: string;
  doc_num: string;
  full_name: string;
  age: number;
  email: string;
  status: string;
}

export interface FormMember {
  id?: number;
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  sex: string;
  status: string;
  email: string;
  avatar?: File;
  password?: string;
}

export interface ResponseMember {
  ok: boolean;
  message: string;
}

export interface Member {
  id: number;
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  status: string;
  user: User;
}
