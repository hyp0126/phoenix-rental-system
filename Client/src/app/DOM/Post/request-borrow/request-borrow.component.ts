import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';
import { ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { environment } from 'src/environments/environment';
import { DetailComponent } from 'src/app/DOM/Main/detail/detail.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { UserDetailsViewComponent } from 'src/app/DOM/Account/user-details-view/user-details-view.component';
import { TransactionStatusEnum, NotificationTypeEnum } from 'src/app/Helpers/enum';
import { FormatUtils } from 'src/app/Helpers/format-utils';
import { Notification } from 'src/app/Models/notification';
import { NotificationDTO } from 'src/app/Models/notificationDTO';
import { TransactionPkgDTO, TransactionDTO } from 'src/app/Models/transactionDTO';
import { UserPkgDTO } from 'src/app/Models/userDetailsDTO';
@Component({
  selector: 'app-request-borrow',
  templateUrl: './request-borrow.component.html',
  styleUrls: ['./request-borrow.component.scss'],
})
export class RequestBorrowComponent implements OnInit {
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  @Input() public itemIdString: string;
  itemId: number;
  borrowItemForm: FormGroup;
  isPreview: boolean;
  isSubmitPressed: boolean;

  itemDefaultPhotoUrl: any;
  noImagePhotoUrl: string = environment.PhotoFileUrl + 'noImage.png';
  userId: string;
  diffDays: number = 0;
  showMore: boolean;
  maxTextViewLen: number = 50;
  itemTransactions: any[] = [];

  formatDate = FormatUtils.formatDate;
  formatCurrency = FormatUtils.formatCurrency;

  minDate: Date;
  maxDate: Date;
  disabledDates: Date[] = [];

  displayBorrowedDates = false;

  ownerDetails: any = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    photourl: '',
    phone: '',
    statusId: 0,
  };

  itemPkg: any = {
    item: {
      id: 0,
      userId: '',
      categoryId: 1,
      name: '',
      description: '',
      deposit: 0.0,
      fee: 0.0,
      startDate: new Date(),
      endDate: new Date(),
      //addressId: 0,
    },
    address: {
      id: 0,
      userId: '',
      isDefault: false,
      address1: '',
      address2: '',
      city: '',
      provinceId: 1,
      postalCode: '',
    },
  };

  transactionPkg: TransactionPkgDTO = {
    trans: {
      id: 0,
      itemId: 0,
      borrowerId: '',
      borrowerName: '',
      startDate: new Date(),
      endDate: new Date(),
      requestDate: new Date(),
      reason: '',
      refundDeposit: 0,
      currentStatus: TransactionStatusEnum.Request,
      statusName: '',
      total: 0,
      deposit: 0,
    },
    tranDetails: {
      id: 0,
      transactionId: 0,
      statusId: 1,
      statusName: '',
      reason: '',
      date: new Date(),
    },
  };

  notification: Notification = {
    id: 0,
    fromUserId: '',
    toUserId: '',
    itemId: 0,
    notiType: NotificationTypeEnum.Request,
    message: '',
    sendDate: new Date(),
    isRead: false,
  };

  validation_messages = {
    startDate: [{ type: 'required', message: 'Start Date is required' }],
    endDate: [
      { type: 'required', message: 'End Date is required' },
      { type: 'dateOrder', message: 'End Date should be greater than or equal Start Date' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private service: SharedService
  ) {
    this.isPreview = false;
    this.isSubmitPressed = false;
    this.showMore = false;

    if (this.service.isLoginUser) {
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.itemIdString = this.route.snapshot.queryParamMap.get('itemId');
    this.itemId = parseInt(this.itemIdString);
    this.createBorrowItemForm();
    this.setFormData();

    if (this.itemId != null) {
      this.loadItemPkg(this.itemId);
      this.loadDefaultPhotoAddr(this.itemId);
    }
  }

  createBorrowItemForm() {
    this.borrowItemForm = this.fb.group({
      //      priceInfo: this.fb.group({
      borrowInfo: new FormGroup({
        dates: new FormControl('', Validators.required),
      }),
    });
  }

  get borrowInfo() {
    return this.borrowItemForm.controls.borrowInfo as FormGroup;
  }

  getFormData() {
    this.transactionPkg.trans.startDate = this.borrowInfo.get('dates').value[0];
    this.transactionPkg.trans.endDate = this.borrowInfo.get('dates').value[1];
  }

  setFormData() {
    this.borrowInfo.get('dates').setValue([this.transactionPkg.trans.startDate, this.transactionPkg.trans.endDate]);
  }

  loadItemPkg(itemId: number) {
    this.service.getItem(itemId).subscribe((data: any) => {
      this.itemPkg = {
        item: data.item,
        address: data.address,
      };

      this.itemPkg.item.startDate = new Date(data.item.startDate);
      this.itemPkg.item.endDate = new Date(data.item.endDate);

      this.transactionPkg.trans.startDate = this.itemPkg.item.startDate;
      this.transactionPkg.trans.endDate = this.itemPkg.item.endDate;

      this.minDate = this.itemPkg.item.startDate;
      this.maxDate = this.itemPkg.item.endDate;

      var currentDate: Date = new Date();

      if (
        this.transactionPkg.trans.startDate < currentDate &&
        this.transactionPkg.trans.startDate.getDate() != currentDate.getDate()
      ) {
        this.transactionPkg.trans.startDate = currentDate;
        this.minDate = currentDate;
      }

      if (this.itemPkg.item.userId) {
        this.getOwnerDetails();
      }

      this.setFormData();
    });

    this.getTransactions(itemId); // comment for testing duplicated reseravtion
  }

  loadDefaultPhotoAddr(itemId: number) {
    this.service.getItemPhotos(itemId).subscribe(
      (data) => {
        data.forEach((element) => {
          this.itemDefaultPhotoUrl = environment.PhotoFileUrl + element.fileName;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getOwnerDetails() {
    this.service.getOwnerInfo(this.itemPkg.item.userId).subscribe(
      (data: UserPkgDTO) => {
        if (data.details != null) {
          this.ownerDetails = data.details;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openDetail(id: any) {
    const dialogRef = this.dialog.open(DetailComponent, {
      // height: '500px',
      width: '600px',
      data: {
        dataKey: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openOwnerDetails(id: any) {
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

  getTransactions(itemId: number) {
    this.service.getItemBorrowedDate(itemId).subscribe((data: TransactionDTO[]) => {
      //console.log(data);
      data.forEach((trans) => {
        this.itemTransactions.push(trans);
        this.addDisabledDates(new Date(trans.startDate), new Date(trans.endDate));
      });
    });
  }

  addDisabledDates(startDate, endDate) {
    var now = new Date(startDate);

    while (DateValidator.compareDateWithoutForm(now, endDate) >= 0) {
      this.disabledDates.push(now);
      now = new Date(now.valueOf() + 864e5); // Add 1 day
    }
  }

  validateDates(startDate, endDate) {
    var retFlag = true;

    if (this.itemTransactions.length != 0) {
      this.itemTransactions.forEach((trans) => {
        var tranStartDate = new Date(trans.startDate);
        var tranEndDate = new Date(trans.endDate);

        // endDate < (tranStartDate ~ tranEndDate)
        if (DateValidator.compareDateWithoutForm(endDate, tranStartDate) == 1) {
        }
        // (tranStartDate ~ tranEndDate) < startDate
        else if (DateValidator.compareDateWithoutForm(tranEndDate, startDate) == 1) {
        } else {
          retFlag = false;
        }
      });
    }
    return retFlag;
  }

  onSubmit() {
    this.isSubmitPressed = true;

    if (this.borrowInfo.invalid) {
      return;
    }

    this.transactionPkg.trans.itemId = this.itemId;
    this.transactionPkg.trans.borrowerId = this.userId;
    this.transactionPkg.trans.deposit = this.itemPkg.item.deposit;
    this.transactionPkg.trans.currentStatus = 1;
    this.getFormData();

    // Check other reservations of same item
    var checkDates = this.validateDates(this.transactionPkg.trans.startDate, this.transactionPkg.trans.endDate);
    if (checkDates == false) {
      this.displayBorrowedDates = true;
      return;
    }

    this.diffDays =
      FormatUtils.dateDiffInDays(this.transactionPkg.trans.startDate, this.transactionPkg.trans.endDate) + 1;

    this.transactionPkg.trans.total = this.diffDays * this.itemPkg.item.fee;

    this.isPreview = true;
  }

  onBorrow() {
    if (this.borrowInfo.invalid == false) {
      this.service.insertTransaction(this.transactionPkg).subscribe((data: any) => {
        console.log(data);
        this.service.alert('success', 'Send Request Borrow');
        //this.router.navigate(['/home']);

        //Send Notification
        this.notification.fromUserId = this.userId;
        this.notification.itemId = this.itemPkg.item.id;
        this.notification.toUserId = this.itemPkg.item.userId;
        this.service.insertNotification(this.notification).subscribe((data: NotificationDTO) => {
          console.log(data);
        });
        this.getTransactions(this.itemId);
        this.isPreview = false;
      });
    }
  }

  onCancel() {
    this.isPreview = false;
    this.showMore = false;
  }

  trimString(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}
