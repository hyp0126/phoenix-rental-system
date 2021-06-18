import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { TransactionStatusEnum, NotificationTypeEnum } from 'src/app/helpers/enum';
import { FormatUtils } from 'src/app/helpers/format-utils';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsViewComponent } from 'src/app/pages/account/user-details-view/user-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/pages/shared/confirm-dialog/confirm-dialog.component';
import { ReasonDialogComponent } from 'src/app/pages/shared/reason-dialog/reason-dialog.component';
import { DateValidator } from 'src/app/pages/shared/validators/date.validator';
import { ReviewDialogComponent } from '../../shared/review-dialog/review-dialog.component';
import { ItemReviewPkgDTO } from 'src/app/models/itemDTO';
import { Review } from 'src/app/models/review';
import { Notification } from 'src/app/models/notification';
import { NotificationDTO } from 'src/app/models/notificationDTO';
import { ItemTransactionPkgDTO, TransactionDetailsDTO } from 'src/app/models/transactionDTO';
import { UserPkgDTO } from 'src/app/models/userDetailsDTO';
@Component({
  selector: 'app-my-borrow',
  templateUrl: './my-borrow.component.html',
  styleUrls: ['./my-borrow.component.scss'],
})
export class MyBorrowComponent implements OnInit {
  activeTabId: number = 0;
  userId: string = '';

  requestItemPkgs: ItemTransactionPkgDTO[];
  filteredRequestItemPkgs: ItemTransactionPkgDTO[];
  borrowingItemPkgs: ItemTransactionPkgDTO[];
  filteredBorrowingItemPkgs: ItemTransactionPkgDTO[];
  compledtedItemPkgs: ItemTransactionPkgDTO[];
  filteredCompledtedItemPkgs: ItemTransactionPkgDTO[];

  nameFilter: string = '';
  currentDate: Date = new Date();
  ownerNames: { [key: string]: string } = {};
  notEmptyPost: boolean = true;
  page: number = 0;

  tranDetails: TransactionDetailsDTO = {
    id: 0,
    transactionId: 0,
    statusId: 1,
    statusName: '',
    reason: '',
    date: new Date(),
  };

  notification: Notification = {
    id: 0,
    fromUserId: '',
    toUserId: '',
    itemId: 0,
    notiType: NotificationTypeEnum.RequestReturn,
    message: '',
    sendDate: new Date(),
    isRead: false,
  };

  review: Review = {
    id: 0,
    itemId: 0,
    rate: 1,
    title: '',
    review1: '',
    date: new Date(),
    userId: '',
  };

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;
  dateDiffInDays = FormatUtils.dateDiffInDays;

  constructor(private service: SharedService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    this.page = 0;
    this.notEmptyPost = true;
    this.loadTransaction(this.activeTabId);
  }

  loadTransaction(activeId: number) {
    if (activeId == 0) {
      // Requested Tab
      this.loadTransactionRequested();
    } else if (activeId == 1) {
      // Borrowing Tab
      this.loadTransactionBorrowing();
    } else if (activeId == 2) {
      // Completed Tab
      this.loadTransactionCompleted();
    }
  }

  loadTransactionRequested() {
    this.page = this.page + 1;

    this.service
      .getTransactionByUser(this.page, this.userId, [TransactionStatusEnum.Request])
      .subscribe((transItemPkgs: ItemTransactionPkgDTO[]) => {
        transItemPkgs.forEach((trItemPkg) => {
          trItemPkg.item.defaultImageFile = trItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + trItemPkg.item.defaultImageFile
            : environment.PhotoFileUrl + 'noImage.png';
          this.getOwnerNames(trItemPkg.item.userId);
        });

        if (this.page == 1) {
          this.requestItemPkgs = transItemPkgs;
        } else {
          this.requestItemPkgs.push(...transItemPkgs);
        }

        if (transItemPkgs.length < 8) {
          this.notEmptyPost = false;
        }
        this.filteredRequestItemPkgs = this.requestItemPkgs;
      });
  }

  loadTransactionBorrowing() {
    this.page = this.page + 1;

    this.service
      .getTransactionByUser(this.page, this.userId, [
        TransactionStatusEnum.Confirmed,
        TransactionStatusEnum.RequestReturn,
      ])
      .subscribe((transItemPkgs: ItemTransactionPkgDTO[]) => {
        transItemPkgs.forEach((trItemPkg) => {
          trItemPkg.item.defaultImageFile = trItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + trItemPkg.item.defaultImageFile
            : environment.PhotoFileUrl + 'noImage.png';
          this.getOwnerNames(trItemPkg.item.userId);
        });

        if (this.page == 1) {
          this.borrowingItemPkgs = transItemPkgs;
        } else {
          this.borrowingItemPkgs.push(...transItemPkgs);
        }

        if (transItemPkgs.length < 8) {
          this.notEmptyPost = false;
        }
        this.filteredBorrowingItemPkgs = this.borrowingItemPkgs;
      });
  }

  loadTransactionCompleted() {
    this.page = this.page + 1;

    this.service
      .getTransactionByUser(this.page, this.userId, [
        TransactionStatusEnum.CanceledByBorrower,
        TransactionStatusEnum.CanceledByLender,
        TransactionStatusEnum.Rejected,
        TransactionStatusEnum.ReturnComplete,
      ])
      .subscribe((transItemPkgs: ItemTransactionPkgDTO[]) => {
        transItemPkgs.forEach((trItemPkg) => {
          trItemPkg.item.defaultImageFile = trItemPkg.item.defaultImageFile
            ? environment.PhotoFileUrl + trItemPkg.item.defaultImageFile
            : environment.PhotoFileUrl + 'noImage.png';
          this.getOwnerNames(trItemPkg.item.userId);
        });

        if (this.page == 1) {
          this.compledtedItemPkgs = transItemPkgs;
        } else {
          this.compledtedItemPkgs.push(...transItemPkgs);
        }

        if (transItemPkgs.length < 8) {
          this.notEmptyPost = false;
        }
        this.filteredCompledtedItemPkgs = this.compledtedItemPkgs;
      });
  }

  getOwnerNames(userId: string) {
    var existKey = false;

    if (this.ownerNames != undefined) {
      const keys = Object.keys(this.ownerNames);
      keys.forEach((key) => {
        if (key == userId) existKey = true;
      });
    }

    if (existKey == false) {
      this.service.getOwnerInfo(userId).subscribe(
        (data: UserPkgDTO) => {
          if (data.details != null) {
            var name = data.details.firstName + ' ' + data.details.lastName;
            this.ownerNames[userId] = name;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  trimString(text: string, length: number) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  Filter(tabNum: number) {
    var itemNameFilter = this.nameFilter;
    //var itemDescFilter = this.DescFilter;

    switch (tabNum) {
      case 0:
        if (this.requestItemPkgs) {
          this.filteredRequestItemPkgs = this.requestItemPkgs.filter(function (el: ItemTransactionPkgDTO) {
            return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
          });
        }
      case 1:
        if (this.borrowingItemPkgs) {
          this.filteredBorrowingItemPkgs = this.borrowingItemPkgs.filter(function (el: ItemTransactionPkgDTO) {
            return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
          });
        }
      case 2:
        if (this.compledtedItemPkgs) {
          this.filteredCompledtedItemPkgs = this.compledtedItemPkgs.filter(function (el: ItemTransactionPkgDTO) {
            return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
          });
        }
    }
  }

  onNavChange(event) {
    this.nameFilter = '';
    this.page = 0;
    this.notEmptyPost = true;
    this.loadTransaction(event.nextId);
  }

  openOwnerDetails(id: string) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      // height: '500px',
      width: '300px',
      data: {
        dataKey: id,
        isLender: true,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onCancelRequest(transactionId) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: 'Cancel Request',
      },
    });

    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.CanceledByBorrower;
        this.tranDetails.reason = data;
        this.service.putTransactionDetail(this.tranDetails).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  onCancelReservation(transactionId) {
    // TODO: Check start date (-1)
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: 'Cancel Reservation',
      },
    });

    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.CanceledByBorrower;
        this.tranDetails.reason = data;
        this.service.putTransactionDetail(this.tranDetails).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  onRequestReturn(transactionId) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Request Return',
        message: 'Want to complete the return?<br/> Click Yes, a message is sent to owner',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Send Request Return
        this.tranDetails.transactionId = transactionId;
        this.tranDetails.statusId = TransactionStatusEnum.RequestReturn;
        this.service.putTransactionDetail(this.tranDetails).subscribe(() => {
          //console.log(data);
          this.loadTransaction(this.activeTabId);
          this.service.alert('success', 'Requested Return');
          //this.router.navigate(['/home']);

          //Send Notification
          this.notification.fromUserId = this.userId;
          this.notification.itemId = this.borrowingItemPkgs.find((el) => {
            return el.trans.id == this.tranDetails.transactionId;
          }).item.id;
          this.notification.toUserId = this.borrowingItemPkgs.find((el) => {
            return el.trans.id == this.tranDetails.transactionId;
          }).item.userId;
          this.service.insertNotification(this.notification).subscribe((data: NotificationDTO) => {
            console.log(data);
          });

          this.ngOnInit();
        });
      }
    });
  }

  checkRequestReturn(statusId) {
    // TODO: check available date
    if (statusId == TransactionStatusEnum.RequestReturn) {
      return true;
    } else {
      return false;
    }
  }

  checkCancelBorrow(borrowingItemPkg) {
    if (borrowingItemPkg.trans.currentStatus == TransactionStatusEnum.RequestReturn) {
      return false;
    } else {
      if (borrowingItemPkg.trans.startDate)
        if (DateValidator.compareDateWithoutForm(new Date(), borrowingItemPkg.trans.startDate) == 1) {
          return true;
        } else {
          return false;
        }
    }
  }

  onSubmitReview(compledtedItemPkg) {
    this.service.getItemReview(compledtedItemPkg.item.id).subscribe((data: ItemReviewPkgDTO[]) => {
      this.review.id = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].review.itemId == compledtedItemPkg.item.id && data[i].review.userId == this.userId) {
          this.review = data[i].review;
        }
      }

      if (this.review.id == 0) {
        this.review.rate = 1;
        this.review.title = '';
        this.review.review1 = '';
      }

      const dialogRef = this.dialog.open(ReviewDialogComponent, {
        height: '430px',
        width: '400px',
        data: {
          title: 'Write a Review',
          itemName: compledtedItemPkg.item.name,
          itemRate: this.review.rate,
          reviewTitle: this.review.title,
          review: this.review.review1,
          canDelete: this.review.id != 0,
        },
      });

      dialogRef
        .afterClosed()
        .subscribe((data: { itemRate?: number; reviewTitle?: string; review?: string; isDelete: boolean }) => {
          if (data) {
            if (data.isDelete) {
              this.service.deleteItemReview(this.review.id).subscribe(() => {});
            } else {
              this.review.itemId = compledtedItemPkg.item.id;
              this.review.date = new Date();
              this.review.userId = this.userId;
              this.review.rate = data.itemRate;
              this.review.title = data.reviewTitle;
              this.review.review1 = data.review;
              if (this.review.id == 0) {
                this.service.insertItemReview(this.review).subscribe((data: ItemReviewPkgDTO) => {});
              } else {
                this.service.updateItemReview(this.review).subscribe((data: ItemReviewPkgDTO) => {});
              }
            }
          }
        });
    });
  }

  onLoadMore() {
    this.loadTransaction(this.activeTabId);
  }
}
