export interface UserToken {
  token: string;
  expiration: Date;
  userId: string;
  role: string;
}
