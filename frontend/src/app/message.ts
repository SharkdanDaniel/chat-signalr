export interface Message {
  connectionId?: string
  type?: string;
  msg: string;
  date?: Date;
}
