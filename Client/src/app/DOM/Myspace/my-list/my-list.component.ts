import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
import { environment } from 'src/environments/environment';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransactionStatusEnum } from 'src/app/Helpers/enum';
import { ReasonDialogComponent } from 'src/app/DOM/Shared/reason-dialog/reason-dialog.component';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';
import { ConfirmDialogComponent } from 'src/app/DOM/Shared/confirm-dialog/confirm-dialog.component';
import { ItemTransactionPkgDTO, TransactionDetailsDTO } from 'src/app/Models/transactionDTO';
import { ItemPkgDTO } from 'src/app/Models/itemDTO';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  active = 1;
  userId = '';
  showMore: boolean;
  filePath = environment.PhotoFileUrl;
  NameFilter1: string = '';
  NameFilter2: string = '';
  NameFilter3: string = '';
  NameFilter4: string = '';
  NameFilter5: string = '';
  DescFilter: string = '';
  page1 = 1;
  page2 = 1;
  page3 = 1;
  page4 = 1;
  page5 = 1;
  notEmptyPost1 = true;
  notScrolly1 = true;
  notEmptyPost2 = true;
  notScrolly2 = true;
  notEmptyPost3 = true;
  notScrolly3 = true;
  notEmptyPost4 = true;
  notScrolly4 = true;
  notEmptyPost5 = true;
  notScrolly5 = true;
  NameListWithoutFilter1: any = [];
  NameListWithoutFilter2: any = [];
  NameListWithoutFilter3: any = [];
  NameListWithoutFilter4: any = [];
  NameListWithoutFilter5: any = [];
  itemTransactions: any[] = [];
  userItems: any = [];
  requestItems: any = [];
  processingItems: any = [];
  returnItems: any = [];
  completedItems: any = [];
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
    this.service.getUserItem(this.page1, this.userId).subscribe((userItems: ItemPkgDTO[]) => {
      this.userItems = userItems;
      if (userItems.length < 8) {
        this.notEmptyPost1 = false;
      }
      this.showMore = false;
      this.userItems.forEach((userItem) => {
        userItem.item.defaultImageFile = userItem.item.defaultImageFile
          ? userItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter1 = userItems;
    });
  }

  loadTransactionRequest() {
    this.service.getItemByStatus(this.userId, this.requestStatus).subscribe((requestItems: ItemTransactionPkgDTO[]) => {
      this.requestItems = requestItems;
      console.log(requestItems);
      if (requestItems.length < 8) {
        this.notEmptyPost2 = false;
      }
      this.showMore = false;
      this.requestItems.forEach((requestItem) => {
        requestItem.item.defaultImageFile = requestItem.item.defaultImageFile
          ? requestItem.item.defaultImageFile
          : 'noImage.png';
      });

      this.NameListWithoutFilter2 = requestItems;
    });
  }

  loadTransactionProcessing() {
    this.service
      .getItemByStatus(this.userId, this.processingStatus)
      .subscribe((processingItems: ItemTransactionPkgDTO[]) => {
        this.processingItems = processingItems;
        if (processingItems.length < 8) {
          this.notEmptyPost3 = false;
        }
        this.showMore = false;
        this.processingItems.forEach((processingItem) => {
          processingItem.item.defaultImageFile = processingItem.item.defaultImageFile
            ? processingItem.item.defaultImageFile
            : 'noImage.png';
        });
        this.NameListWithoutFilter3 = processingItems;
      });
  }

  loadTransactionRequestReturn() {
    this.service.getItemByStatus(this.userId, this.returnStatus).subscribe((returnItems: ItemTransactionPkgDTO[]) => {
      this.returnItems = returnItems;
      if (returnItems.length < 8) {
        this.notEmptyPost4 = false;
      }
      this.showMore = false;
      this.returnItems.forEach((returnItem) => {
        returnItem.item.defaultImageFile = returnItem.item.defaultImageFile
          ? returnItem.item.defaultImageFile
          : 'noImage.png';
      });
      this.NameListWithoutFilter4 = returnItems;
    });
  }

  loadTransactionCompleted() {
    this.service
      .getItemByStatus(this.userId, this.completedStatus)
      .subscribe((completedItems: ItemTransactionPkgDTO[]) => {
        this.completedItems = completedItems;
        if (completedItems.length < 8) {
          this.notEmptyPost5 = false;
        }
        this.showMore = false;
        this.completedItems.forEach((completedItem) => {
          completedItem.item.defaultImageFile = completedItem.item.defaultImageFile
            ? completedItem.item.defaultImageFile
            : 'noImage.png';
        });
        this.NameListWithoutFilter5 = completedItems;
      });
  }

  onClick1() {
    this.page1 = this.page1 + 1;
    this.service.getUserItem(this.page1, this.userId).subscribe((userItems: ItemPkgDTO[]) => {
      const newList = userItems;

      if (newList.length < 8) {
        this.notEmptyPost1 = false;
      }

      this.userItems = this.userItems.concat(newList);
      this.notScrolly1 = true;
    });
  }

  onClick2() {
    this.page2 = this.page2 + 1;
    this.service.getItemByStatus(this.userId, this.requestStatus).subscribe((requestItems: ItemTransactionPkgDTO[]) => {
      const requestList = requestItems;

      if (requestList.length < 8) {
        this.notEmptyPost2 = false;
      }

      this.requestItems = this.userItems.concat(requestList);
      this.notScrolly2 = true;
    });
  }

  onClick3() {
    this.page3 = this.page3 + 1;
    this.service
      .getItemByStatus(this.userId, this.processingStatus)
      .subscribe((processingItems: ItemTransactionPkgDTO[]) => {
        const processingList = processingItems;

        if (processingList.length < 8) {
          this.notEmptyPost3 = false;
        }

        this.processingItems = this.userItems.concat(processingList);
        this.notScrolly3 = true;
      });
  }

  onClick4() {
    this.page4 = this.page4 + 1;
    this.service.getItemByStatus(this.userId, this.returnStatus).subscribe((returnItems: ItemTransactionPkgDTO[]) => {
      const returnList = returnItems;

      if (returnList.length < 8) {
        this.notEmptyPost4 = false;
      }

      this.returnItems = this.returnItems.concat(returnList);
      this.notScrolly4 = true;
    });
  }

  onClick5() {
    this.page5 = this.page5 + 1;
    this.service
      .getItemByStatus(this.userId, this.completedStatus)
      .subscribe((completedItems: ItemTransactionPkgDTO[]) => {
        const completedList = completedItems;

        if (completedList.length < 8) {
          this.notEmptyPost5 = false;
        }

        this.completedItems = this.completedItems.concat(completedList);
        this.notScrolly5 = true;
      });
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  FilterFn1() {
    var itemNameFilter = this.NameFilter1;
    var itemDescFilter = this.DescFilter;

    this.userItems = this.NameListWithoutFilter1.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn2() {
    var itemNameFilter = this.NameFilter2;
    var itemDescFilter = this.DescFilter;

    this.requestItems = this.NameListWithoutFilter2.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn3() {
    var itemNameFilter = this.NameFilter3;
    var itemDescFilter = this.DescFilter;

    this.processingItems = this.NameListWithoutFilter3.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn4() {
    var itemNameFilter = this.NameFilter4;
    var itemDescFilter = this.DescFilter;

    this.returnItems = this.NameListWithoutFilter4.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  FilterFn5() {
    var itemNameFilter = this.NameFilter5;
    var itemDescFilter = this.DescFilter;

    this.completedItems = this.NameListWithoutFilter5.filter(function (el: any) {
      return el.item.name.toString().toLowerCase().includes(itemNameFilter.toString().trim().toLowerCase());
    });
  }

  onNavChange(event) {
    this.loadTabItems(event.nextId);
  }

  openBorrowerDetails(id: any) {
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

  confirmBorrow(newTrans: any) {
    this.service.getItemBorrowedDate(newTrans.itemId).subscribe((data: any) => {
      //console.log(data);
      var checkDates = true;
      var requestCount = 0;
      if (data.length != 0) {
        for (var i = 0; i < data.length; i++) {
          var tranStartDate = new Date(data[i].startDate);
          var tranEndDate = new Date(data[i].endDate);

          // endDate < (tranStartDate ~ tranEndDate)
          if (DateValidator.compareDateWithoutForm(newTrans.endDate, tranStartDate) == 1) {
          }
          // (tranStartDate ~ tranEndDate) < startDate
          else if (DateValidator.compareDateWithoutForm(tranEndDate, newTrans.startDate) == 1) {
          } else if (data[i].currentStatus == TransactionStatusEnum.Request) {
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

    this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
      //console.log(data.status);
      this.ngOnInit();
    });
  }

  rejectBorrow(transId: number) {
    this.transDetailPkg.transactionId = transId;
    this.transDetailPkg.statusId = TransactionStatusEnum.Rejected;

    this.rejectAndCancel('Rejection');
  }

  rejectAndCancel(text: any) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      height: '300px',
      width: '400px',
      data: {
        title: text,
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.transDetailPkg.reason = data;
        this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
          //console.log(data);
          this.ngOnInit();
        });
      }
    });
  }

  cancelBorrow(transId: any) {
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

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.transDetailPkg.reason = data.reason;
        returnItem.trans.refundDeposit = data.refundDeposit;

        this.service.updateTransaction(returnItem.trans).subscribe((data: any) => {
          //console.log(data.status);
          this.transDetailPkg.transactionId = returnItem.trans.id;
          this.transDetailPkg.statusId = TransactionStatusEnum.ReturnComplete;

          this.service.putTransactionDetail(this.transDetailPkg).subscribe((data: any) => {
            //console.log(data.status);
            this.ngOnInit();
          });
        });
      }
    });
  }
}
