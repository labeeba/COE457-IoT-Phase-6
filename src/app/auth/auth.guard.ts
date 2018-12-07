import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private authService: AuthService, private router: Router) {}

  //the Can activate method of the guard is called by the angular router before nevigating to the path
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    //checking if the sessionStorage has a user logged in or not, if not, navigate to the login page
    if(!sessionStorage.getItem('user')){
        this.router.navigate(['/login']);
    }
    return true;
  }

}
