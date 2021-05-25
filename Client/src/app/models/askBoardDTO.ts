// AskBoardDTO
export interface Article {
  id: number;
  userId: string;
  date: Date;
  title: string;
  description: string;
  parentId?: number;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  photoUrl: string;
  phone: string;
}
