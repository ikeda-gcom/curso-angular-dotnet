import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  public eventos: any = [];
  public eventosFiltrados: any = [];
  widthImg: number = 150;
  marginImg: number = 2;
  ocultarImg = false;
  descricaoImg = "ocultar";
  private _filtroLista: string = "";

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista): this.eventos;
  }
  
  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
                      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  
  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.getEventos();
  }
  
  public getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)
      );
    }

  public ocultarExibir(): void {
    this.ocultarImg = !this.ocultarImg;

    if(!this.ocultarImg)
      this.descricaoImg = "ocultar";
    else
      this.descricaoImg = "exibir";
  }
}
