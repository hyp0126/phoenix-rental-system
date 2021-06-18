import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { FormatUtils } from 'src/app/helpers/format-utils';
import { UserPkgDTO, UserDetailsDTO } from 'src/app/models/userDetailsDTO';
@Component({
  selector: 'app-user-details-view',
  templateUrl: './user-details-view.component.html',
  styleUrls: ['./user-details-view.component.scss'],
})
export class UserDetailsViewComponent implements OnInit {
  PhotoFileName: string = '';
  PhotoFilePath: string = '';
  currentRate: number = 0;
  historyCount: number = 0;
  isLoading: boolean = true;
  isLender: boolean = false;

  ownerDetails: UserDetailsDTO = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    photoUrl: '',
    phone: '',
    statusId: 0,
  };

  formatDate = FormatUtils.formatDate;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dataKey: string;
      isLender: boolean;
    },
    private service: SharedService
  ) {}

  ngOnInit(): void {
    //console.log(this.data.dataKey);
    this.isLender = this.data.isLender;
    this.service.getOwnerInfo(this.data.dataKey).subscribe(
      (data: UserPkgDTO) => {
        if (data.details != null) {
          this.ownerDetails = data.details;
          this.PhotoFileName = data.details.photoUrl;
          if (this.PhotoFileName == '') {
            this.PhotoFileName = 'anonymous.jpg';
          }
          this.PhotoFilePath = environment.PhotoFileUrl + this.PhotoFileName;
        }
      },
      (error) => {
        console.log(error);
      }
    );
    if (this.isLender == true) {
      this.service.getOwnerRateAndItems(this.data.dataKey).subscribe((data: string[]) => {
        this.historyCount = parseInt(data[0]);
        this.currentRate = parseInt(data[1]);
        this.isLoading = false;
      });
    }
  }
}
