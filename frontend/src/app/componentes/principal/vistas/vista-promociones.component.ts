import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromocionesInterface } from '../modelos/promociones/promociones.interface';
import { ServicioGestionClientesService } from '../servicios/clientes/servicio-gestion-clientes.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';

@Component({
  selector: 'app-vista-promociones',
  templateUrl: './vista-promociones.component.html',
  styleUrls: ['./vista-promociones.component.css']
})
export class VistaPromocionesComponent implements AfterViewChecked {
  formularioCorreo!: PromocionesInterface
  adjuntos: File[] = [];
  previsualizacionesAdjuntos: string[] = [];
  actualizarPrevisualizacionArchivo = false;

  constructor(
    private servicio_genericos: ServicioGenericosService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private servicio_gestion: ServicioGestionClientesService
  ) {
    this.formularioCorreo = this.fb.group({
      asunto: this.fb.nonNullable.control('', [Validators.required]),
      cuerpo: this.fb.nonNullable.control('', [Validators.required]),
      
    });
  }

  ngAfterViewChecked() {
    if (this.actualizarPrevisualizacionArchivo) {
      this.cdRef.detectChanges(); // Detectar cambios después de agregar archivos adjuntos
      this.actualizarPrevisualizacionArchivo = false;
    }
  }

  adjuntarArchivo() {
    const archivoInput: HTMLInputElement | null = document.querySelector('#archivoInput');
    if (archivoInput) {
      archivoInput.click();
    }
  }

  manejarArchivoInput(event: Event) {
    const archivoInput = event.target as HTMLInputElement;
    if (archivoInput.files) {
      const archivos = Array.from(archivoInput.files);
      archivos.forEach((adjunto: File) => {
        this.adjuntos.push(adjunto);
        this.convertirArchivoADataUrl(adjunto).then((dataUrl: string) => {
          this.previsualizacionesAdjuntos.push(dataUrl);
          this.actualizarPrevisualizacionArchivo = true;
        });
      });
      archivoInput.value = ''; // Limpiar el valor del input de archivo
    }
  }

  convertirArchivoADataUrl(adjunto: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(adjunto);
    });
  }

  eliminarAdjunto(index: number) {
    if (index >= 0 && index < this.adjuntos.length) {
      this.adjuntos.splice(index, 1);
      this.previsualizacionesAdjuntos.splice(index, 1);
      this.actualizarPrevisualizacionArchivo = true;
    }
  }

  enviarCorreo() {
    const formData = new FormData();
    formData.append('asunto', this.formularioCorreo.value.asunto || '');
    formData.append('cuerpo', this.formularioCorreo.value.cuerpo || '');
    this.adjuntos.forEach((adjunto: File) => {
      formData.append('archivos', adjunto, adjunto.name);
    });
  
    this.servicio_gestion.EnviarCorreoPromocional(formData).subscribe(
      response => {
        this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
        // Restablecer el formulario y los adjuntos después de enviar el correo
        this.formularioCorreo.reset();
        this.adjuntos = [];
        this.previsualizacionesAdjuntos = [];
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }
}
