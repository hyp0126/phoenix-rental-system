import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { PhotoDTO } from 'src/app/models/itemDTO';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  photos: PhotoDTO[] = [];
  PhotoFilePath: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: SharedService) {
    this.PhotoFilePath = environment.PhotoFileUrl;
  }

  ngOnInit(): void {
    console.log(this.data.dataKey);
    this.service.getItemPhotos(this.data.dataKey).subscribe(
      (data: PhotoDTO[]) => {
        this.photos = data;
        console.log(this.PhotoFilePath);
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
