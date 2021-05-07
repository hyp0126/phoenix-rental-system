import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AlertsComponent } from 'src/app/DOM/Shared/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { map, catchError } from 'rxjs/operators';
// import { User } from '../Models/user';

import { ItemReviewPkgDTO } from 'src/app/Models/itemDTO';
import { Review } from 'src/app/Models/review';
import { NotificationDTO } from 'src/app/Models/notificationDTO';
import { Notification } from 'src/app/Models/notification';
import { CategoryDTO } from 'src/app/Models/categoryDTO';
import { Category } from 'src/app/Models/category';
import {
  ItemTransactionPkgDTO,
  TransactionPkgDTO,
  TransactionDTO,
  TransactionDetailsDTO,
} from 'src/app/Models/transactionDTO';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  private subjectNotification = new Subject<any>();
  private subjectReloadHome = new Subject<any>();

  sendNotificationCount(count: number) {
    this.subjectNotification.next(count);
  }

  clearNotificationCount() {
    this.subjectNotification.next();
  }

  getNotificationCount(): Observable<number> {
    return this.subjectNotification.asObservable();
  }

  sendNotificationReloadHome() {
    this.subjectReloadHome.next();
  }

  clearNotificationReloadHome() {
    this.subjectReloadHome.next();
  }

  getNotificationReloadHome(): Observable<any> {
    return this.subjectReloadHome.asObservable();
  }

  public get getUserInfo() {
    var id = this.isLoginUser.replace(/['"]+/g, '');
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
  }

  public getOwnerInfo(id: string) {
    if (!id) return;
    return this.http.get<any>(`${environment.apiUrl}/UserDetails/GetUser/` + id);
  }

  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Lookup/GetProvinces`);
  }

  updateUser(val: any) {
    //alert(val.details.statusId);
    if (val.details.statusId == 0) {
      return this.http.post<any>(`${environment.apiUrl}/UserDetails/InsertUser`, val);
    } else {
      return this.http.put<any>(`${environment.apiUrl}/UserDetails/UpdateUser`, val);
    }
  }

  uploadPhoto(val: any) {
    return this.http.post(`${environment.apiUrl}/UserDetails/SaveAvatar`, val);
  }

  upload(file: any) {
    let input = new FormData();
    input.append('filesData', file);
    return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, input);
  }

  get isLoginUser() {
    return localStorage.getItem('userId');
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/Lookup/GetCategories`);
  }

  insertItem(val: any) {
    return this.http.post<any>(`${environment.apiUrl}/Item`, val);
  }

  uploadItemPhoto(val: any) {
    return this.http.post(`${environment.apiUrl}/Item/SavePhotos`, val);
  }

  getItem(val: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItem/` + val);
  }

  getUserItem(page: any, val: any) {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetUserItemsAndDefaultPhoto/` + page + '/' + val);
  }

  updateItem(val: any) {
    return this.http.put<any>(`${environment.apiUrl}/Item`, val);
  }

  getSearchedItemAndDefaultPhoto(page: any, search: string, city: string, categoryId: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/Item/GetSearchedItemAndDefaultPhoto/` + page + '/' + search + '/' + city + '/' + categoryId
    );
  }

  getItemPhotos(val: any) {
    return this.http.get<any>(`${environment.apiUrl}/Item/GetItemPhotos/` + val);
  }

  getItemPhotoFile(val: any): Observable<any> {
    return this.http.get(`${environment.PhotoFileUrl}` + val, { responseType: 'blob' });
  }

  getArticleList() {
    return this.http.get<any>(`${environment.apiUrl}/AskBoard/`);
  }

  getArticleWithReply(val: any) {
    return this.http.get<any>(`${environment.apiUrl}/AskBoard/GetArticleWithReply?Id=${val}`);
  }

  insertArticle(askBoardPkg: any) {
    return this.http.post<any>(`${environment.apiUrl}/AskBoard/InsertArticle`, askBoardPkg);
  }

  updateArticle(askBoardPkg: any) {
    return this.http.put<any>(`${environment.apiUrl}/AskBoard/UpdateArticle`, askBoardPkg);
  }

  updateReply(askBoardPkg: any) {
    return this.http.put<any>(`${environment.apiUrl}/AskBoard/UpdateReply`, askBoardPkg);
  }
  deleteArticle(id: any) {
    return this.http.delete<any>(`${environment.apiUrl}/AskBoard/DeleteArticle/` + id);
  }

  deleteReply(id: any) {
    return this.http.delete<any>(`${environment.apiUrl}/AskBoard/DeleteReply/` + id);
  }

  insertReply(askReplyPkg: any) {
    return this.http.post<any>(`${environment.apiUrl}/AskBoard/InsertReply`, askReplyPkg);
  }

  getItemByStatus(userId: string, statusIds: number[]): Observable<ItemTransactionPkgDTO[]> {
    const params = new HttpParams().set('userId', userId).set('statusIds', statusIds.join(','));
    return this.http.get<ItemTransactionPkgDTO[]>(`${environment.apiUrl}/Transaction`, { params: params });
  }

  getTransactionByUser(userId: string, statusIds: number[]): Observable<ItemTransactionPkgDTO[]> {
    const params = new HttpParams().set('userId', userId).set('statusIds', statusIds.join(','));
    return this.http.get<ItemTransactionPkgDTO[]>(`${environment.apiUrl}/Transaction/GetTransactionByUser`, {
      params: params,
    });
  }

  insertTransaction(transPkg: TransactionPkgDTO): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Transaction`, transPkg);
  }

  updateTransaction(trans: TransactionDTO): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Transaction/UpdateTransaction`, trans);
  }

  putTransactionDetail(tDetail: TransactionDetailsDTO): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Transaction/InsertTransactionDetails`, tDetail);
  }

  getItemBorrowedDate(itemId: number): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${environment.apiUrl}/Transaction/getItemBorrowedDate?itemId=${itemId}`);
  }

  insertNotification(notification: Notification): Observable<NotificationDTO> {
    return this.http.post<NotificationDTO>(`${environment.apiUrl}/Notification/InsertNotification`, notification);
  }

  getNotification(userId: string, startDate: string): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(
      `${environment.apiUrl}/Notification/getNotification?userId=${userId}&startDate=${startDate}`
    );
  }

  updateNotificationStatus(notiId: number): Observable<NotificationDTO> {
    return this.http.put<NotificationDTO>(
      `${environment.apiUrl}/Notification/UpdateNotificationStatus?notiId=${notiId}`,
      ''
    );
  }

  manageCategory(categoryDTO: CategoryDTO): Observable<Category[]> {
    return this.http.put<Category[]>(`${environment.apiUrl}/Admin/ManageCategory/`, categoryDTO);
  }

  getItemReview(itemId: number): Observable<ItemReviewPkgDTO[]> {
    return this.http.get<ItemReviewPkgDTO[]>(`${environment.apiUrl}/Item/GetItemReview/${itemId}`);
  }

  getItemReviewAvg(itemId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Item/GetItemReviewAvg/${itemId}`);
  }

  getOwnerRateAndItems(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/Item/GetOwnerRateAndItems/${userId}`);
  }

  insertItemReview(review: Review): Observable<ItemReviewPkgDTO> {
    return this.http.post<ItemReviewPkgDTO>(`${environment.apiUrl}/Item/InsertReview`, review);
  }

  updateItemReview(review: Review): Observable<ItemReviewPkgDTO> {
    return this.http.put<ItemReviewPkgDTO>(`${environment.apiUrl}/Item/UpdateReview`, review);
  }

  deleteItemReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Item/DeleteReview/${reviewId}`);
  }

  getCityOfAddress(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/Item/GetCityOfAddress`);
  }

  //type: success, info, warning, danger
  alert(t: string, m: string): void {
    const timeout = 2000;
    const dialogRef = this.dialog.open(AlertsComponent, {
      width: '360px',
      data: { type: t, msg: m },
    });
    dialogRef.afterOpened().subscribe((_) => {
      if (t != 'danger') {
        setTimeout(() => {
          dialogRef.close();
        }, timeout);
      }
    });
  }
}
