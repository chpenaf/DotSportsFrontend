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

export interface Response {
  message: string;
}

export interface SetNewPasswordResponse {
  success: boolean;
  message: string;
}

export interface Response2 {
  code: string;
  message: string;
}
