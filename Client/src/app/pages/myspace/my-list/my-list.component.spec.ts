import 'zone.js/dist/zone-testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { MyListComponent } from './my-list.component';
import { SharedService } from '../../../services/shared.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

let userId = '51afd4fa-7b65-47fd-b62a-a4a42ff10979';

describe('MyListComponent', () => {
  let component: MyListComponent;
  let fixture: ComponentFixture<MyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyListComponent],
      providers: [
        { provide: AuthService },
        { provide: MatDialog, useValue: {} },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: SharedService },
        JwtHelperService,
      ],
      imports: [HttpClientModule, NgbModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
