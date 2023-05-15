import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuloPrincipalModule } from './componentes/principal/modulo-principal.module';
import { ModuloRegistroModule } from './componentes/registro/modulo-registro.module';
import { ModuloLoginModule } from './componentes/login/modulo-login.module';

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
    ModuloLoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
