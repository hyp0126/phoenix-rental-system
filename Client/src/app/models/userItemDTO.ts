import { ItemDTO, PhotoDTO } from 'src/app/models/itemDTO';

export interface UserItemPkgDTO {
  userItem: UserItemDTO;
  item: ItemDTO[];
  photo: PhotoDTO[];
}

export interface UserItemDTO {
  id: number;
  userId: string;
  itemId: number;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  refund: number;
  createdDate: Date;
  timeStamp: Date;
  statusId?: number;
  statusName: string;
}

export interface RoleDTO {
  id: string;
  name: string;
}
