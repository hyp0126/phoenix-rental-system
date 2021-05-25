export interface Notification {
  id: number;
  fromUserId: string;
  toUserId: string;
  itemId?: number;
  notiType?: number;
  message: string;
  sendDate?: Date;
  isRead?: boolean;
}
