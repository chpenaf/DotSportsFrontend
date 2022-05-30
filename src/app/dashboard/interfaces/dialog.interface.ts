export interface DialogToConfirm {
  title: string;
  message: string;
  id?: number;
  cancel: Button;
  confirm: Button;
}

export interface Button {
  text: string;
  color?: string;
}

export interface DialogForm {
  title: string;
  input1: Input;
}

export interface Input {
  id?: number;
  label: string;
  input: string;
  value: string;
}
