//import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../../../services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormatUtils } from 'src/app/helpers/format-utils';
import { Location } from '@angular/common';
import { UserDetailsViewComponent } from 'src/app/pages/account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/pages/shared/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../../shared/edit-dialog/edit-dialog.component';
import { NotificationTypeEnum } from 'src/app/helpers/enum';
import { Notification } from 'src/app/models/notification';
import { NotificationDTO } from 'src/app/models/notificationDTO';
import { Article } from 'src/app/models/askBoardDTO';
import { DirtyComponent } from 'src/app/models/dirty.component';
import { EditorComponent } from 'src/app/pages/shared/editor/editor.component';

@Component({
  selector: 'app-ask-detail',
  templateUrl: './ask-detail.component.html',
  styleUrls: ['./ask-detail.component.scss'],
})
export class AskDetailComponent implements OnInit, DirtyComponent {
  //dataSource: MatTableDataSource<Article>;
  @ViewChild(EditorComponent) editor: EditorComponent;

  panelOpenState: boolean = true;
  isDirty: boolean = false;

  content: string;

  userId: string = '';
  rowId: number;
  path: string;
  url: string;
  name: string;
  title: string;
  headContent: string;
  articles: Article[] = [];
  filePath: string = environment.PhotoFileUrl;
  formatDate = FormatUtils.formatDate;

  askReplyPkg: Article = {
    id: 0,
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    photoUrl: '',
    phone: '',
  };

  askReplyEditPkg: Article = {
    id: 0,
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    parentId: 0,
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    photoUrl: '',
    phone: '',
  };

  notification: Notification = {
    id: 0,
    fromUserId: '',
    toUserId: '',
    itemId: 0,
    notiType: NotificationTypeEnum.AskReply,
    message: '',
    sendDate: new Date(),
    isRead: false,
  };

  constructor(
    private route: ActivatedRoute,
    private service: SharedService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');
    if (this.rowId === undefined) this.rowId = Number(this.route.snapshot.queryParamMap.get('rowId'));
    this.loadInitAskDetail();
    //this.content = 'Test Content'; // Ask content test
  }

  canDeactivate() {
    return this.isDirty;
  }

  loadInitAskDetail() {
    this.service.getArticleWithReply(this.rowId).subscribe((data: Article[]) => {
      // console.log(data);
      this.articles = data;
      this.content = '';
      for (let el of data) {
        if (el.id === this.rowId) {
          this.title = el.title;
          this.headContent = el.description;
        }
      }
    });
  }

  requestAskReply() {
    this.askReplyPkg.userId = this.userId;
    this.askReplyPkg.parentId = this.rowId;
    this.askReplyPkg.title = this.title;
    this.askReplyPkg.description = this.content;
    //console.log(this.askReplyPkg);
    this.service.insertReply(this.askReplyPkg).subscribe(() => {
      this.sendNotification();
      this.ngOnInit();
      this.content = '<p></p>';
      this.editor.clearContent();
      this.isDirty = false;
    });
  }

  sendNotification() {
    //Send Notification
    this.notification.fromUserId = this.userId;
    this.notification.itemId = 10; // dummy itemId for backend API
    this.notification.toUserId = this.articles[0].userId; //parent userId
    this.notification.message = this.askReplyPkg.title;
    this.service.insertNotification(this.notification).subscribe((data: NotificationDTO) => {
      //console.log(data);
    });
  }

  onBack() {
    this.location.back();
  }

  onChange(content: string) {
    if (this.content.localeCompare(content)) {
      this.isDirty = true;
    }
    this.content = content;
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm deletion',
        message: 'Want to delete the reply?<br/> Click Yes, The reply will be deleted',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteReply(id).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  onEdit(id: number, content: string, title: string) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      height: '450px',
      width: '800px',
      data: {
        content: content,
      },
    });

    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.askReplyEditPkg.id = id;
        this.askReplyEditPkg.userId = this.userId;
        this.askReplyEditPkg.description = data;
        this.askReplyEditPkg.title = title;
        this.askReplyEditPkg.parentId = this.rowId;

        //console.log(this.askReplyEditPkg);
        this.service.updateReply(this.askReplyEditPkg).subscribe(() => {
          this.service.alert('success', 'The content is changed.');
          this.ngOnInit();
        });
      }
    });
  }

  openBorrowerDetails(id: string) {
    const dialogRef = this.dialog.open(UserDetailsViewComponent, {
      width: '300px',
      data: {
        dataKey: id,
        isLender: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(`Dialog result: ${result}`);
    });
  }
}
