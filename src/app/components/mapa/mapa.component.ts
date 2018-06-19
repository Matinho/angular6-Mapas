import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapaEditarComponent } from './mapa-editar.component';
import { resolve } from 'q';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];

  lat = 51.678418;
  lng = 7.809007;

  constructor( public snackBar: MatSnackBar, public dialog: MatDialog ) {

    if ( localStorage.getItem('marcadores')) {
      this.marcadores = JSON.parse( localStorage.getItem('marcadores') );
    }
  }

  ngOnInit() {
  }

  agregarMarcador( evento ) {

    const coords: { lat: number, lng: number } = evento.coords;
    const nuevoMarcador = new Marcador(coords.lat, coords.lng);
    this.marcadores.push(nuevoMarcador);
    this.guardarStorage();
    this.snackBar.open('Marcador Agregado', 'Cerrar', { duration: 3000 } );

  }

  // hacemos esta funcion porque el localstorage solo almacena strings
  guardarStorage() {
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
  }

  borrarMarcador( idx: number ) {
    this.marcadores.splice( idx, 1 ); // Splice(posicionInicial, cantABorrar)
    this.guardarStorage();
    this.snackBar.open('Marcador Borrado', 'Cerrar', { duration: 3000 } );

  }

  editarMarcador( marcador: Marcador ) {

     const dialogRef = this.dialog.open( MapaEditarComponent , {
       width: '250px',
       data: { titulo: marcador.titulo, descripcion: marcador.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.descripcion = result.descripcion;

      this.guardarStorage();

      this.snackBar.open('Marcador Actualizado', 'Cerrar', { duration: 3000 } );

    });

  }

}
