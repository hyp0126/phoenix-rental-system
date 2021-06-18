import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { UserDetailsViewComponent } from 'src/app/pages/account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransactionStatusEnum } from 'src/app/helpers/enum';
import { ReasonDialogComponent } from 'src/app/pages/shared/reason-dialog/reason-dialog.component';
import { FormatUtils } from 'src/app/helpers/format-utils';
import { DateValidator } from 'src/app/pages/shared/validators/date.validator';
import { ConfirmDialogComponent } from 'src/app/pages/shared/confirm-dialog/confirm-dialog.component';
import { ItemTransactionPkgDTO, TransactionDetailsDTO, TransactionDTO } from 'src/app/models/transactionDTO';
import { ItemPkgDTO } from 'src/app/models/itemDTO';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  active: number = 1;
  userId: string = '';
  showMore: boolean;
  filePath: string = environment.PhotoFileUrl;
  nameFilter: string = '';
  page: number = 1;
  notEmptyPost: boolean = true;
  userItemsWithoutFilter: ItemPkgDTO[] = [];
  requestItemsWithoutFilter: ItemTransactionPkgDTO[] = [];
  processingItemsWithoutFilter: ItemTransactionPkgDTO[] = [];
  returnItemsWithoutFilter: ItemTransactionPkgDTO[] = [];
  completedItemsWithoutFilter: ItemTransactionPkgDTO[] = [];
  userItems: ItemPkgDTO[] = [];
  requestItems: ItemTransactionPkgDTO[] = [];
  processingItems: ItemTransactionPkgDTO[] = [];
  returnItems: ItemTransactionPkgDTO[] = [];
  completedItems: ItemTransactionPkgDTO[] = [];
  requestStatus: number[] = [TransactionStatusEnum.Request];
  processingStatus: number[] = [TransactionStatusEnum.Confirmed];
  returnStatus: number[] = [TransactionStatusEnum.RequestReturn];
  completedStatus: number[] = [
    TransactionStatusEnum.Rejected,
    TransactionStatusEnum.CanceledByBorrower,
    TransactionStatusEnum.CanceledByLender,
    TransactionStatusEnum.ReturnComplete,
  ];

  transDetailPkg: TransactionDetailsDTO = {
    id: 0,
    transactionId: 0,
    statusId: 0,
    statusName: '',
    reason: '',
    date: new Date(),
  };

  currentDate: Date = new Date();

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;
  dateDiffInDays = FormatUtils.dateDiffInDays;

  constructor(private service: SharedService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.loadTabItems(this.active);
  }

  loadTabItems(activeId) {
    this.page = 1;
    this.nameFilter = '';
    this.notEmptyPost = true;

    if (activeId == 1) {
      // My Items
      this.loadUserItems();
    } else if (activeId == 2) {
      // Request
      this.loadTransactionRequest();
    } else if (activeId == 3) {
      // Processing Items
      this.loadTransactionProcessing();
    } else if (activeId == 4) {
      // Request Return
      this.loadTransactionRequestReturn();
    } else if (activeId == 5) {
      // Completed
      this.loadTransactionCompleted();
    }
  }

  loadUserItems() {
    this.service.getUserItem(this.page, this.userId).subscribe((userItems: ItemPkgDTO[]) => {
      this.userItems = userItems;
      if (userItems.length < 8) {
        this.notEmptyPost = false;
      }
      this.showMore = false;
      this.userItems.forEach((userItem) => {
        userItem.item.defaultImageFile = userItem.item.defaultImageFile
          ? userItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.userItemsWithoutFilter = this.userItems;
    });
  }

  loadTransactionRequest() {
    this.service
      .getItemByStatus(this.page, this.userId, this.requestStatus)
      .subscribe((requestItems: ItemTransactionPkgDTO[]) => {
        this.requestItems = requestItems;
        if (requestItems.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;
        this.requestItems.forEach((requestItem) => {
          requestItem.item.defaultImageFile = requestItem.item.defaultImageFile
            ? requestItem.item.defaultImageFile
            : 'noImage.png';
        });

        this.requestItemsWithoutFilter = this.requestItems;
      });
  }

  loadTransactionProcessing() {
    this.service
      .getItemByStatus(this.page, this.userId, this.processingStatus)
      .subscribe((processingItems: ItemTransactionPkgDTO[]) => {
        this.processingItems = processingItems;
        if (processingItems.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;
        this.processingItems.forEach((processingItem) => {
          processingItem.item.defaultImageFile = processingItem.item.defaultImageFile
            ? processingItem.item.defaultImageFile
            : 'noImage.png';
        });
        this.processingItemsWithoutFilter = this.processingItems;
      });
  }

  loadTransactionRequestReturn() {
    this.service
      .getItemByStatus(this.page, this.userId, this.returnStatus)
      .subscribe((returnItems: ItemTransactionPkgDTO[]) => {
        this.returnItems = returnItems;
        if (returnItems.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;
        this.returnItems.forEach((returnItem) => {
          returnItem.item.defaultImageFile = returnItem.item.defaultImageFile
            ? returnItem.item.defaultImageFile
            : 'noImage.png';
        });
        this.returnItemsWithoutFilter = this.returnItems;
      });
  }

  loadTransactionCompleted() {
    this.service
      .getItemByStatus(this.page, this.userId, this.completedStatus)
      .subscribe((completedItems: ItemTransactionPkgDTO[]) => {
        this.completedItems = completedItems;
        if (completedItems.length < 8) {
          this.notEmptyPost = false;
        }
        this.showMore = false;
        this.completedItems.forEach((completedItem) => {
          completedItem.item.defaultImageFile = completedItem.item.defaultImageFile
            ? completedItem.item.defaultImageFile
            : 'noImage.png';
        });
        this.completedItemsWithoutFilter = this.completedItems;
      });
  }

  onLoadMoreItem() {
    this.page = this.page + 1;
    this.service.getUserItem(this.page, this.userId).subscribe((userItems: ItemPkgDTO[]) => {
      const newList = userItems;

      if (newList.length < 8) {
        this.notEmptyPost = false;
      }

      this.userItems = this.userItems.concat(newList);
      this.userItemsWithoutFilter = this.userItems;
    });
  }

  onLoadMoreRequest() {
    this.page = this.page + 1;
    this.service
      .getItemByStatus(this.page, this.userId, this.requestStatus)
      .subscribe((requestItems: ItemTransactionPkgDTO[]) => {
        const requestList = requestItems;

        if (requestList.length < 8) {
          this.notEmptyPost = false;
        }

        this.requestItems = this.requestItems.concat(requestList);
        this.requestItemsWithoutFilter = this.requestItems;
      });
  }

  onLoadMoreProcessing() {
    this.page = this.page + 1;
    this.service
      .getItemByStatus(this.page, this.userId, this.processingStatus)
      .subscribe((processingItems: ItemTransactionPkgDTO[]) => {
        const processingList = processingItems;

        if (processingList.length < 8) {
          this.notEmptyPost = false;
        }

        this.processingItems = this.processingItems.concat(processingList);
        this.processingItemsWithoutFilter = this.processingItems;
      });
  }

  onLoadMoreReturn() {
    this.page = this.page + 1;
    this.service
      .getItemByStatus(this.page, this.userId, this.returnStatus)
      .subscribe((returnItems: ItemTransactionPkgDTO[]) => {
        const returnList = returnItems;

        if (returnList.length < 8) {
          this.notEmptyPost = false;
        }

        this.returnItems = this.returnItems.concat(returnList);
        this.returnItemsWithoutFilter = this.returnItems;
      });
  }

  onLoadMoreCompleted() {
    this.page = this.page + 1;
    this.service
      .getItemByStatus(this.page, this.userId, this.completedStatus)
      .subscribe((completedItems: ItemTransactionPkgDTO[]) => {
        const completedList = completedItems;

        if (completedList.length < 8) {
          this.notEmptyPost = false;
        }

        this.completedItems = this.completedItems.concat(completedList);
        this.completedItemsWithoutFilter = this.completedItems;
      });
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  filterItem() {
    var itemNameFilter = this.nameFilter;

    this.userItems = this.userItemsWithoutFilter.filter(function (el: ItemPkgDTO) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  filterRequest() {
    var itemNameFilter = this.nameFilter;

    this.requestItems = this.requestItemsWithoutFilter.filter(function (el: ItemTransactionPkgDTO) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  filterProcessing() {
    var itemNameFilter = this.nameFilter;

    this.processingItems = this.processingItemsWithoutFilter.filter(function (el: ItemTransactionPkgDTO) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  filterReturn() {
    var itemNameFilter = this.nameFilter;

    this.returnItems = this.returnItemsWithoutFilter.filter(function (el: ItemTransactionPkgDTO) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  filterCompleted() {
    var itemNameFilter = this.nameFilter;

    this.completedItems = this.completedItemsWithoutFilter.filter(function (el: ItemTransactionPkgDTO) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  onNavChange(event) {
    this.loadTabItems(event.nextId);
  }

  openBorrowerDetails(id: string) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      // height: '500px',
      width: '300px',
      data: {
        dataKey: id,
        isLender: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  confirmBorrow(newTrans: TransactionDTO) {
    this.service.getItemBorrowedDate(newTrans.itemId).subscribe((transDTOs: TransactionDTO[]) => {
      //console.log(data);
      var checkDates = true;
      var requestCount = 0;
      if (transDTOs.length != 0) {
        for (var i = 0; i < transDTOs.length; i++) {
          var tranStartDate = new Date(transDTOs[i].startDate);
          var tranEndDate = new Date(transDTOs[i].endDate);

          // endDate < (tranStartDate ~ tranEndDate)
          if (DateValidator.compareDateWithoutForm(newTrans.endDate, tranStartDate) == 1) {
          }
          // (tranStartDate ~ tranEndDate) < startDate
          else if (DateValidator.compareDateWithoutForm(tranEndDate, newTrans.startDate) == 1) {
          } else if (transDTOs[i].currentStatus == TransactionStatusEnum.Request) {
            requestCount++;
          } else {
            checkDates = false;
          }
        }
      }

      // Check other reservations of same item
      if (checkDates == false) {
        this.service.alert('danger', 'This item was already reserved.<br/> Please, Reject this request.');
        return;
      }

      // Check other requests of same item
      if (requestCount > 1) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Duplicated Request Alert',
            message:
              `This item was requested from <b>${requestCount} lenders</b><br />` + 'Do you confirm this request?',
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.sendConfirmBorrow(newTrans.id);
          }
        });
        return;
      } else {
        this.sendConfirmBorrow(newTrans.id);
      }
    });
  }

  sendConfirmBorrow(transId: number) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.Confirmed;

    this.service.putTransactionDetail(this.transDetailPkg).subscribe(() => {
      //console.log(data.status);
      this.ngOnInit();
    });
  }

  rejectBorrow(transId: number) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.Rejected;

    this.rejectAndCancel('Rejection');
  }

  rejectAndCancel(text: string) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: text,
      },
    });

    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.transDetailPkg.reason = data;
        this.service.putTransactionDetail(this.transDetailPkg).subscribe(() => {
          //console.log(data);
          this.ngOnInit();
        });
      }
    });
  }

  cancelBorrow(transId: number) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.CanceledByLender;

    this.rejectAndCancel('Cancellation');
  }

  returnComplete(returnItem: ItemTransactionPkgDTO) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      height: '400px',
      width: '400px',
      data: {
        title: 'Return',
        isRefund: true,
        deposit: returnItem.trans.deposit,
      },
    });

    dialogRef.afterClosed().subscribe((data: { refundDeposit: number; reason: string }) => {
      if (data) {
        this.transDetailPkg.reason = data.reason;
        returnItem.trans.refundDeposit = data.refundDeposit;

        this.service.updateTransaction(returnItem.trans).subscribe(() => {
          //console.log(data.status);
          this.transDetailPkg.transactionId = returnItem.trans.id;
          this.transDetailPkg.statusId = TransactionStatusEnum.ReturnComplete;

          this.service.putTransactionDetail(this.transDetailPkg).subscribe(() => {
            //console.log(data.status);
            this.ngOnInit();
          });
        });
      }
    });
  }
}
