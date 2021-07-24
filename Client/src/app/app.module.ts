import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

/* DOM Components */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { HeaderComponent } from './pages/navigation/header/header.component';
import { SideMenuComponent } from './pages/navigation/side-menu/side-menu.component';
import { HomeComponent } from './pages/main/home/home.component';
import { DetailComponent } from './pages/main/detail/detail.component';
import { PostComponent } from './pages/post/post.component';
import { AddEditPostComponent } from './pages/post/add-edit-post/add-edit-post.component';
import { UserAccountComponent } from './pages/account/user-account/user-account.component';
import { UserDetailsComponent } from './pages/account/user-details/user-details.component';
import { AskComponent } from './pages/ask/ask.component';
import { PostCardComponent } from './pages/post/post-card/post-card.component';
import { MapsComponent } from './pages/navigation/maps/maps.component';
import { MyListComponent } from './pages/myspace/my-list/my-list.component';
import { MyBorrowComponent } from './pages/myspace/my-borrow/my-borrow.component';
import { AskDetailComponent } from './pages/ask/ask-detail/ask-detail.component';
import { EditorComponent } from './pages/shared/editor/editor.component';
import { RequestBorrowComponent } from './pages/post/request-borrow/request-borrow.component';
import { UserDetailsViewComponent } from './pages/account/user-details-view/user-details-view.component';
import { NotificationListComponent } from './pages/myspace/notification-list/notification-list.component';
import { ReasonDialogComponent } from './pages/shared/reason-dialog/reason-dialog.component';
import { ReviewDialogComponent } from './pages/shared/review-dialog/review-dialog.component';

/* Account */
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { PRSAdminComponent } from './pages/account/prsadmin/prsadmin.component';
import { PRSAdminPopupComponent } from './pages/account/prsadmin-popup/prsadmin-popup.component';

/* common component */
import { AvatarComponent } from './pages/navigation/avatar/avatar.component';
import { ConfirmDialogComponent } from './pages/shared/confirm-dialog/confirm-dialog.component';
import { AlertsComponent } from './pages/shared/alerts/alerts.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './helpers/angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Ngx Bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { AlertModule } from 'ngx-bootstrap/alert';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Authenticate */
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';

/* Currency Input */
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from 'src/environments/environment';

/* Drag & Drop Files */
import { NgxFileDropModule } from 'ngx-file-drop';

/* Services */
import { SharedService } from 'src/app/services/shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

/* Pipes */
import { AuthImgPipe } from './helpers/auth-img.pipe';

import { environment } from 'src/environments/environment';
import { EditDialogComponent } from './pages/shared/edit-dialog/edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    SideMenuComponent,
    HomeComponent,
    DetailComponent,
    PostComponent,
    UserAccountComponent,
    AvatarComponent,
    UserDetailsComponent,
    AskComponent,
    AddEditPostComponent,
    PostCardComponent,
    MapsComponent,
    AlertsComponent,
    MyListComponent,
    MyBorrowComponent,
    AskDetailComponent,
    EditorComponent,
    RequestBorrowComponent,
    UserDetailsViewComponent,
    AuthImgPipe,
    ConfirmDialogComponent,
    ChangePasswordComponent,
    PRSAdminComponent,
    NotificationListComponent,
    ReasonDialogComponent,
    ReviewDialogComponent,
    EditDialogComponent,
    PRSAdminPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,

    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    NgbModule,
    HttpClientModule,
    NgxEditorModule,

    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('jwt');
        },
        allowedDomains: environment.allowedDomains,
        disallowedRoutes: environment.disallowedRoutes,
      },
    }),

    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxFileDropModule,
  ],
  providers: [AuthService, SharedService, AuthenticationService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
