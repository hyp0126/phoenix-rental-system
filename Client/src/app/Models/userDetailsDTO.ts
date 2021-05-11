import { RoleDTO } from 'src/app/Models/userItemDTO';

export interface UserAccountDTO {
  id?: string;
  email?: string;
}

export interface UserDetailsDTO {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  phone?: string;
  createdDate?: Date;
  timeStamp?: Date;
  statusId?: number;
  statusName?: string;
}

export interface AddressDTO {
  id?: number;
  userId?: string;
  isDefault?: boolean;
  address1?: string;
  address2?: string;
  provinceId?: number;
  provinceCode?: string;
  provinceName?: string;
  city?: string;
  postalCode?: string;
}

export interface UserPkgDTO {
  account: UserAccountDTO;
  details: UserDetailsDTO;
  address: AddressDTO;
  role?: RoleDTO;
}

export interface UserInfo {
  email: string;
  password: string;
  newPassword?: string;
}
