import { ItemDTO } from 'src/app/models/itemDTO';

export interface TransactionPkgDTO {
  trans: TransactionDTO;
  tranDetails: TransactionDetailsDTO;
}
export interface ItemTransactionListPkgDTO {
  item: ItemDTO;
  trans: TransactionDTO[];
}

export interface ItemTransactionPkgDTO {
  item: ItemDTO;
  trans: TransactionDTO;
}

export interface TransactionStatusDTO {
  id: number;
  status: string;
}

export interface TransactionStatusListDTO {
  statusList: TransactionStatusDTO[];
}

export interface TransactionDTO {
  id: number;
  itemId: number;
  borrowerId: string;
  borrowerName: string;
  startDate: Date;
  endDate: Date;
  requestDate: Date;
  reason: string;
  total?: number;
  deposit?: number;
  refundDeposit?: number;
  currentStatus?: number;
  statusName: string;
}

export interface TransactionDetailsDTO {
  id: number;
  transactionId: number;
  statusId: number;
  statusName: string;
  reason: string;
  date: Date;
}
