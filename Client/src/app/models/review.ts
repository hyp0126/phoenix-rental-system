export interface Review {
  id: number;
  itemId: number;
  rate: number;
  title: string;
  review1: string;
  date?: Date;
  userId: string;
}
