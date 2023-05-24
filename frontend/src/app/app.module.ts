import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuloPrincipalModule } from './componentes/principal/modulo-principal.module';
import { ModuloRegistroModule } from './componentes/registro/modulo-registro.module';
import { ModuloLoginModule } from './componentes/login/modulo-login.module';
import { ModuloGenericosModule } from './componentes/genericos/modulo-genericos.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { ServicioAuthService } from './componentes/login/servicios/servicio-auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModuloPrincipalModule,
    ModuloRegistroModule,
    ModuloLoginModule,
    ModuloGenericosModule
  ],
  providers: [
    ServicioAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
