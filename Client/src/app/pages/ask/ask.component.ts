import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { UserDetailsViewComponent } from 'src/app/pages/account/user-details-view/user-details-view.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/pages/shared/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../shared/edit-dialog/edit-dialog.component';
import { Article } from 'src/app/models/askBoardDTO';
import { DirtyComponent } from 'src/app/models/dirty.component';
import { EditorComponent } from 'src/app/pages/shared/editor/editor.component';

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AskComponent implements AfterViewInit, DirtyComponent {
  askTitle: string;
  askDescription: string;
  content: string;
  isDirty: boolean = false;

  askBoardPkg: Article = {
    id: 0,
    date: new Date(),
    title: '',
    description: '',
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    photoUrl: '',
    phone: '',
  };

  askEditPkg: Article = {
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

  active = 1;
  displayedColumns: string[] = ['id', 'userName', 'title', 'date', 'edit'];
  dataSource: MatTableDataSource<Article>;
  expandedElement: Article | null;

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(EditorComponent) editor: EditorComponent;

  userId: string = '';
  showMore: boolean;
  filePath: string = environment.PhotoFileUrl;
  articles: Article[] = [];
  page: number = 1;
  count: number = 0;

  constructor(private service: SharedService, public dialog: MatDialog) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render;
  }

  ngOnInit(): void {
    this.userId = this.service.isLoginUser;
    this.userId = this.userId.replace(/['"]+/g, '');

    this.askBoardPkg.title = '';
    this.askBoardPkg.description = '';
    this.content = '';
    this.loadUserItem();
  }

  canDeactivate() {
    return this.isDirty;
  }

  loadUserItem() {
    this.service.getArticleList().subscribe((data: Article[]) => {
      this.articles = data;
      this.dataSource = new MatTableDataSource(this.articles);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  requestAsk() {
    this.askBoardPkg.userId = this.userId;
    this.askBoardPkg.description = this.content;
    console.log(this.askBoardPkg);
    this.service.insertArticle(this.askBoardPkg).subscribe(() => {
      this.ngOnInit();
      this.content = '<p></p>';
      this.editor.clearContent();
      this.isDirty = false;
    });
  }

  onDelete(id: number) {
    this.count = 0;
    this.service.getArticleWithReply(id).subscribe((data: Article[]) => {
      this.count = data.length - 1;
      if (this.count > 0) this.service.alert('warning', 'This asked content cannot be deleted because a reply exists.');
      else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Confirm deletion',
            message: 'Want to delete the asked content?<br/> Click Yes, The asked content will be deleted',
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.service.deleteArticle(id).subscribe(() => {
              this.ngOnInit();
            });
          }
        });
      }
    });
  }

  onChange(content: string) {
    if (this.content.localeCompare(content)) {
      this.isDirty = true;
    }
    this.content = content;
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
        this.askEditPkg.id = id;
        this.askEditPkg.userId = this.userId;
        this.askEditPkg.description = data;
        this.askEditPkg.title = title;
        this.askEditPkg.parentId = id;

        console.log(this.askEditPkg);
        this.service.updateArticle(this.askEditPkg).subscribe(() => {
          this.service.alert('success', 'The content is changed.');
          this.ngOnInit();
        });
      }
    });
  }
}
