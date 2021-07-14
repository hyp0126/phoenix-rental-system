import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DirtyComponent } from 'src/app/models/dirty.component';

@Injectable({
  providedIn: 'root',
})
export class DirtyGuard implements CanDeactivate<DirtyComponent> {
  canDeactivate(
    component: DirtyComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()) {
      return confirm('Unsaved data will be lost. Do you want to continue?');
    } else {
      return true;
    }
  }
}
