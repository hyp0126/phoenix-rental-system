import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-popup',
  templateUrl: './prsadmin-popup.component.html',
  styleUrls: ['./prsadmin-popup.component.scss'],
})
export class PRSAdminPopupComponent {
  action: string;
  local_data: Category;

  constructor(
    public dialogRef: MatDialogRef<PRSAdminPopupComponent>,
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
