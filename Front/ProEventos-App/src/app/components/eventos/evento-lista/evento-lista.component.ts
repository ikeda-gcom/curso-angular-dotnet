import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;
  
  public widthImg: number = 150;
  public marginImg: number = 2;
  public ocultarImg = false;
  public descricaoImg = "ocultar";
  public classeImg = "fa fa-eye-slash";
  private _filtroLista: string = "";


  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista): this.eventos;
  }
  
  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
                      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  
  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  
  public ngOnInit() {
    this.showSpinner('sp3');
    this.carregarEventos();
  }
  
  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar os eventos.', 'Error!')
      }
    }).add(() => this.hideSpinner('sp3'));
  }

  public ocultarExibir(): void {
    this.ocultarImg = !this.ocultarImg;

    if(!this.ocultarImg) {
      this.descricaoImg = "ocultar";
      this.classeImg = "fa fa-eye-slash"
    }
    else {
      this.descricaoImg = "exibir";
      this.classeImg = "fa fa-eye"
    }
  }

  openModal(event:any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if (result.message === 'Excluído') {
          this.toastr.success('O Evento foi excluído com sucesso!', 'Excluído!');
          this.carregarEventos();
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar excluir evento ${this.eventoId}`, 'Erro!');
      }    
    ).add(() => this.hideSpinner('sp3'));
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

  showSpinner(name: string) {
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide(name);
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
