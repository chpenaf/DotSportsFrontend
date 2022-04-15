export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
  is_staff: boolean;
}

export interface CreateUser {

  email: string;
  first_name: string;
  last_name: string;
  avatar?: File;
  is_staff: boolean;

}
