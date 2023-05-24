import { Injectable } from '@angular/core';
import { ServicioLoginService } from './servicio-login.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginInterface } from '../modelos/login.interface';
import { BehaviorSubject, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ServicioAuthService {
  private readonly TOKEN_KEY = 'token';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoogedIn$ = this._isLoggedIn$.asObservable();
  private _userRole$ = new BehaviorSubject<string>('');
  public userRole$ = this._userRole$.asObservable();
  constructor(private servicio: ServicioLoginService, private cookieService: CookieService) {
    const token = this.cookieService.get(this.TOKEN_KEY);
    this.validateTokenExpiration(token);
    this.getUserRoleFromToken(token);
  }
  
  login(form:LoginInterface){
    return this.servicio.LoginByForm(form).pipe(
      tap(response =>{
        this.validateTokenExpiration(response.auth_token);
        this.getUserRoleFromToken(response.auth_token);
        this.cookieService.set(this.TOKEN_KEY, response.auth_token);
      })
    );
    
  }

  private validateTokenExpiration(token: string) {
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        const currentDate = new Date();
        if (currentDate > expirationDate) {
          this.cookieService.delete(this.TOKEN_KEY);
          this._isLoggedIn$.next(false);
        } else {
          this._isLoggedIn$.next(true);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.cookieService.delete(this.TOKEN_KEY);
        this._isLoggedIn$.next(false);
      }
    } else {
      this._isLoggedIn$.next(false);
    }
  }

  private getUserRoleFromToken(token: string) {
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const userRole = decodedToken.rol;
        this._userRole$.next(userRole);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this._userRole$.next('');
      }
    } else {
      this._userRole$.next('');
    }
  }

}
