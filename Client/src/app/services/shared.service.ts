import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AlertsComponent } from 'src/app/pages/shared/alerts/alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { map, catchError } from 'rxjs/operators';
// import { User } from '../Models/user';

import { ItemReviewPkgDTO } from 'src/app/models/itemDTO';
import { Review } from 'src/app/models/review';
import { NotificationDTO } from 'src/app/models/notificationDTO';
import { Notification } from 'src/app/models/notification';
import { CategoryDTO } from 'src/app/models/categoryDTO';
import { Category } from 'src/app/models/category';
import {
  ItemTransactionPkgDTO,
  TransactionPkgDTO,
  TransactionDTO,
  TransactionDetailsDTO,
} from 'src/app/models/transactionDTO';
import { Article } from 'src/app/models/askBoardDTO';
import { Province } from 'src/app/models/province';
import { UserPkgDTO } from 'src/app/models/userDetailsDTO';
import { ItemPkgDTO, PhotoDTO, ItemDTO } from 'src/app/models/itemDTO';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  private subjectNotification = new Subject<number>();
  private subjectReloadHome = new Subject<boolean>();

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
    this.subjectReloadHome.next(true);
  }

  clearNotificationReloadHome() {
    this.subjectReloadHome.next();
  }

  getNotificationReloadHome(): Observable<boolean> {
    return this.subjectReloadHome.asObservable();
  }

  public get getUserInfo(): Observable<UserPkgDTO> {
    var userId = this.isLoginUser.replace(/['"]+/g, '');
    if (!userId) return;
    return this.http.get<UserPkgDTO>(`${environment.apiUrl}/UserDetails/GetUser/` + userId);
  }

  public getOwnerInfo(userId: string): Observable<UserPkgDTO> {
    if (!userId) return;
    return this.http.get<UserPkgDTO>(`${environment.apiUrl}/UserDetails/GetUser/` + userId);
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${environment.apiUrl}/Lookup/GetProvinces`);
  }

  updateUser(userPkgDTO: UserPkgDTO): Observable<UserPkgDTO> {
    //alert(val.details.statusId);
    if (userPkgDTO.details.statusId == 0) {
      return this.http.post<UserPkgDTO>(`${environment.apiUrl}/UserDetails/InsertUser`, userPkgDTO);
    } else {
      return this.http.put<UserPkgDTO>(`${environment.apiUrl}/UserDetails/UpdateUser`, userPkgDTO);
    }
  }

  uploadPhoto(form: FormData): Observable<{ filePath: string }> {
    return this.http.post<{ filePath: string }>(`${environment.apiUrl}/UserDetails/SaveAvatar`, form);
  }

  // upload(file: any) {
  //   let input = new FormData();
  //   input.append('filesData', file);
  //   return this.http.post(`${environment.apiUrl}/UserDetails/SavePhoto`, input);
  // }

  get isLoginUser() {
    return localStorage.getItem('userId');
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/Lookup/GetCategories`);
  }

  insertItem(itemPkgDTO: ItemPkgDTO): Observable<ItemPkgDTO> {
    return this.http.post<ItemPkgDTO>(`${environment.apiUrl}/Item`, itemPkgDTO);
  }

  uploadItemPhoto(form: FormData): Observable<{ filePathList: string[] }> {
    return this.http.post<{ filePathList: string[] }>(`${environment.apiUrl}/Item/SavePhotos`, form);
  }

  getItem(itemId: number): Observable<ItemPkgDTO> {
    return this.http.get<ItemPkgDTO>(`${environment.apiUrl}/Item/GetItem/` + itemId);
  }

  getUserItem(page: number, userId: string): Observable<ItemPkgDTO[]> {
    return this.http.get<ItemPkgDTO[]>(`${environment.apiUrl}/Item/GetUserItemsAndDefaultPhoto/` + page + '/' + userId);
  }

  updateItem(itemPkgDTO: ItemPkgDTO): Observable<ItemPkgDTO> {
    return this.http.put<ItemPkgDTO>(`${environment.apiUrl}/Item`, itemPkgDTO);
  }

  getSearchedItemAndDefaultPhoto(
    page: number,
    search: string,
    city: string,
    categoryId: number
  ): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(
      `${environment.apiUrl}/Item/GetSearchedItemAndDefaultPhoto/` + page + '/' + search + '/' + city + '/' + categoryId
    );
  }

  getItemPhotos(itemId: number): Observable<PhotoDTO[]> {
    return this.http.get<PhotoDTO[]>(`${environment.apiUrl}/Item/GetItemPhotos/` + itemId);
  }

  getItemPhotoFile(fileName: string): Observable<any> {
    return this.http.get(`${environment.PhotoFileUrl}` + fileName, { responseType: 'blob' });
  }

  getArticleList(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/AskBoard/`);
  }

  getArticleWithReply(id: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/AskBoard/GetArticleWithReply?Id=${id}`);
  }

  insertArticle(askBoardPkg: Article) {
    return this.http.post<any>(`${environment.apiUrl}/AskBoard/InsertArticle`, askBoardPkg);
  }

  updateArticle(askBoardPkg: Article) {
    return this.http.put<any>(`${environment.apiUrl}/AskBoard/UpdateArticle`, askBoardPkg);
  }

  updateReply(askBoardPkg: Article) {
    return this.http.put<any>(`${environment.apiUrl}/AskBoard/UpdateReply`, askBoardPkg);
  }

  deleteArticle(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/AskBoard/DeleteArticle/` + id);
  }

  deleteReply(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/AskBoard/DeleteReply/` + id);
  }

  insertReply(askReplyPkg: Article) {
    return this.http.post<any>(`${environment.apiUrl}/AskBoard/InsertReply`, askReplyPkg);
  }

  getItemByStatus(userId: string, statusIds: number[]): Observable<ItemTransactionPkgDTO[]> {
    const params = new HttpParams().set('userId', userId).set('statusIds', statusIds.join(','));
    return this.http.get<ItemTransactionPkgDTO[]>(`${environment.apiUrl}/Transaction`, { params: params });
  }

  getTransactionByUser(page: number, userId: string, statusIds: number[]): Observable<ItemTransactionPkgDTO[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('userId', userId)
      .set('statusIds', statusIds.join(','));
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
