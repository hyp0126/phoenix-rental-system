import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { UserAccountComponent } from './pages/account/user-account/user-account.component';
import { HomeComponent } from './pages/main/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { AskComponent } from 'src/app/pages/ask/ask.component';
import { AskDetailComponent } from 'src/app/pages/ask/ask-detail/ask-detail.component';
import { MyListComponent } from 'src/app/pages/myspace/my-list/my-list.component';
import { MyBorrowComponent } from 'src/app/pages/myspace/my-borrow/my-borrow.component';
import { EditorComponent } from 'src/app/pages/shared/editor/editor.component';
import { RequestBorrowComponent } from './pages/post/request-borrow/request-borrow.component';
import { AuthService } from './services/auth.service';
import { ChangePasswordComponent } from 'src/app/pages/account/change-password/change-password.component';
import { PRSAdminComponent } from 'src/app/pages/account/prsadmin/prsadmin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-account', component: UserAccountComponent, canActivate: [AuthService] },
  { path: 'post', component: PostComponent, canActivate: [AuthService] },
  { path: 'my-list', component: MyListComponent, canActivate: [AuthService] },
  { path: 'my-borrow', component: MyBorrowComponent, canActivate: [AuthService] },
  { path: 'ask', component: AskComponent, canActivate: [AuthService] },
  { path: 'ask-detail', component: AskDetailComponent, canActivate: [AuthService] },
  { path: 'editor', component: EditorComponent },
  { path: 'request-borrow', component: RequestBorrowComponent, canActivate: [AuthService] },
  { path: 'prspassword', component: ChangePasswordComponent, canActivate: [AuthService] },
  { path: 'prsadmin', component: PRSAdminComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
