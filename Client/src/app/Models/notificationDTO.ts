export interface NotificationDTO {
  id: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  itemId?: number;
  itemTitle: string;
  notiType?: number;
  type: string;
  message: string;
  sendDate?: Date;
  isRead?: boolean;
}
