export interface DialogToConfirm {
  title: string;
  message: string;
  id?: number;
  cancel: Button;
  confirm: Button;
}

export interface Button{
  text: string;
  color?: string;
}
