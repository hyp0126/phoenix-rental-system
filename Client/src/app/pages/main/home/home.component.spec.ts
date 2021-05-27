import 'zone.js/dist/zone-testing';
import { AuthService } from '../../../services/auth.service';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Component, Input } from '@angular/core';
import { ItemDTO } from 'src/app/models/itemDTO';

@Component({ selector: 'app-post-card', template: '' })
class PostCardComponent {
  @Input() property: ItemDTO[];
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, PostCardComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        { provide: AuthService },
        { provide: MatDialog, useValue: {} },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.properties = [
      {
        id: 0,
        userId: '',
        categoryId: 1,
        categoryName: '',
        name: 'Bike',
        description: '',
        defaultImageFile: '',
        deposit: 50,
        fee: 2,
        startDate: new Date(),
        addressId: 1,
        createdDate: new Date(),
        timeStamp: new Date(),
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct properties values', () => {
    component.properties[0] = {
      id: 0,
      userId: '',
      categoryId: 1,
      categoryName: '',
      name: 'Bike',
      description: '',
      defaultImageFile: '11b5bd7e-24fb-4d69-b035-f3feccbaca50',
      deposit: 50,
      fee: 2,
      startDate: new Date(),
      addressId: 1,
      createdDate: new Date(),
      timeStamp: new Date(),
    };
    expect(component.properties[0].name).toEqual('Bike');
    expect(component.properties[0].defaultImageFile).toEqual('11b5bd7e-24fb-4d69-b035-f3feccbaca50');
    expect(component.properties[0].deposit).toEqual(50);
    expect(component.properties[0].fee).toEqual(2);
  });

  it('LOAD MORE Button method should be called', fakeAsync(() => {
    spyOn(component, 'onClick');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();

    fixture.whenStable().then(() => {
      expect(component.onClick).toHaveBeenCalled();
    });
  }));
});
