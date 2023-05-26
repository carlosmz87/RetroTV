import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioGestionClientesService } from '../servicios/clientes/servicio-gestion-clientes.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientesInterface } from '../modelos/clientes/gestion-clientes.interface';
import { Router} from '@angular/router';


@Component({
  selector: 'app-vista-gestion-clientes',
  templateUrl: './vista-gestion-clientes.component.html',
  styleUrls: ['./vista-gestion-clientes.component.css']
})
export class VistaGestionClientesComponent implements OnInit {
  dataSource!: MatTableDataSource<ClientesInterface>;
  displayedColumns: string[] = ['id', 'nombre', 'usuario', 'correo', 'telefono', 'fecha_nacimiento', 'genero', 'suscripcion','activarSuscripcion','cancelarSuscripcion','eliminar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private servicio: ServicioGestionClientesService, private servicios_genericos: ServicioGenericosService) { }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {
    this.ListarClientes();
  }

  ListarClientes() {
    this.servicio.ListarClientes().subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.servicios_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarUsuario(id:Number){
    console.log(id);
  }

  activarSuscripcion(id:Number){
    console.log(id);
  }

  cancelarSuscripcion(id:Number){
    console.log(id)
  }


}
