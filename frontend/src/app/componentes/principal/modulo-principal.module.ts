import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPrincipalComponent } from './vistas/vista-principal.component';



@NgModule({
  declarations: [
    VistaPrincipalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VistaPrincipalComponent
  ]
})
export class ModuloPrincipalModule { }
