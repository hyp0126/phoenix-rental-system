export interface ItemReviewPkgDTO {
  item: ItemDTO;
  review: ReviewDTO;
}

export interface ItemDTO {
  id: number;
  userId: string;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  defaultImageFile: string;
  deposit: number;
  fee: number;
  startDate: Date;
  endDate?: Date;
  addressId: number;
  createdDate: Date;
  timeStamp: Date;
  statusId?: number;
  statusName: string;
}

export interface ReviewDTO {
  id: number;
  itemId: number;
  rate: number;
  title: string;
  review1: string;
  date: Date;
  userId: string;
  userName: string;
}
