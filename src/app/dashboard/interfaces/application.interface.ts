export interface App {
  id?: number;
  name: string;
  path: string;
  icon: string;
  text: string;
  position: number;
  admin: boolean;
  staff: boolean;
  member: boolean;
}
