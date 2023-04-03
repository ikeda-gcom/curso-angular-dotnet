import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';
import { TituloComponent } from '../../shared/titulo/titulo.component';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  /* Serviço injetado no módulo */
  // providers: [EventoService]
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  
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
    private spinner: NgxSpinnerService
  ) { }
  
  public ngOnInit() {
    this.showSpinner('sp3');
    this.getEventos();
  }
  
  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.hideSpinner('sp3'),
        this.toastr.error('Erro ao carregar os eventos.', 'Error!')
      },
      complete: () => this.hideSpinner('sp3')
    });
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

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.showSuccess();
    this.modalRef?.hide();
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

  showSuccess() {
    this.toastr.success('O Evento foi excluído com sucesso!', 'Excluído!');
  }

  showSpinner(name: string) {
    this.spinner.show(name);
  }

  hideSpinner(name: string) {
    this.spinner.hide(name);
  }
}
