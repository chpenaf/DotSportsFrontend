import { ListMembers } from './member.interface';

export interface CreditDialog {
  title: string,
  location: number;
  member: ListMembers
}

export interface CreditHeader {
  id?: number;
  location?: number;
  member?: number;
  quantity?: number;
  status?: string;
  begin_validity?: Date | string;
  end_validity?: Date | string;
  entered_by?: number;
  doc_ref?: string;
  positions?: CreditPos[];
}

export interface CreditPos {
  id?: number;
  pos: number;
  begin_validity: Date;
  end_validity: Date;
  status: string;
  used_at: string;
}
