import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { DirtyComponent } from 'src/app/models/dirty.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, DirtyComponent {
  userId: string;
  itemId: string;
  isDirty: boolean = false;

  constructor(private router: Router, private service: SharedService) {
    if (this.service.isLoginUser) {
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    //this.itemId = "15";
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  canDeactivate() {
    return this.isDirty;
  }

  onChange(isDirty: boolean) {
    this.isDirty = isDirty;
  }
}
