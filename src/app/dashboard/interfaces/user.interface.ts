export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
  is_staff: boolean;
}
