export interface Token {
  refresh: string;
  access: string;
}

export interface Refresh {
  access: string;
}

export interface SignupForm {
  doc_num: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  email: string;
  password: string;
}
