import { Component, OnInit, Input, Inject, Optional, ViewChild, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CategoryDTO } from 'src/app/models/categoryDTO';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-prsadmin',
  templateUrl: './prsadmin.component.html',
  styleUrls: ['./prsadmin.component.scss'],
})
export class PRSAdminComponent implements OnInit {
  @Input()
  public userEmail: string;
  categoryForm: FormGroup;
  categoryList: Category[];
  displayedColumns: string[] = ['id', 'name', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<Category>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: SharedService,
    public dialog: MatDialog
  ) {
    this.loadCategoryList();
  }

  loadCategoryList() {
    this.service.getCategories().subscribe((categories: Category[]) => {
      this.categoryList = categories;
    });
  }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      newCategory: new FormControl('', null),
    });
  }

  onSubmitAddNewCategory(value, opt, mess) {
    var val: CategoryDTO = {
      option: opt, // insert:1,update:2,delete:3
      id: value.categoryId,
      name: value.name,
    };
    this.service.manageCategory(val).subscribe(
      (res) => {
        this.service.alert('success', 'successfully ' + mess + '!!');
        this.loadCategoryList();
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  openDialog(action: string, obj: Category) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '300px',
      data: { category: obj, action: action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Category) {
    this.onSubmitAddNewCategory(row_obj, 1, 'insert');
  }

  updateRowData(row_obj: Category) {
    this.categoryList = this.categoryList.filter((value, key) => {
      if (value.categoryId == row_obj.categoryId) {
        value.name = row_obj.name;
        this.onSubmitAddNewCategory(row_obj, 2, 'update');
      }
      return true;
    });
  }

  deleteRowData(row_obj: Category) {
    this.categoryList = this.categoryList.filter((value, key) => {
      if (value.categoryId == row_obj.categoryId) {
        this.onSubmitAddNewCategory(row_obj, 3, 'delete');
      }
      return value.categoryId != row_obj.categoryId;
    });
  }
}

@Component({
  selector: 'app-popup',
  templateUrl: './prsadmin-popup.component.html',
  styleUrls: ['./prsadmin.component.scss'],
})
export class PopupComponent {
  action: string;
  local_data: Category;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { category: Category; action: string }
  ) {
    this.local_data = data.category;
    this.action = data.action;
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
