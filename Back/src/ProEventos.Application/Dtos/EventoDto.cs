using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
  public class EventoDto
    {
        public int Id { get; set; }

        public string Local { get; set; }

        public DateTime? DataEvento { get; set; }

        [Required(ErrorMessage = "{0} é obrigatório"),
         StringLength( 50, MinimumLength = 3, ErrorMessage = "{0} deve ter entre 3 e 50 caracteres")]
        public string Tema { get; set; }

        [Display(Name = "Qtd Pessoas")]
        [Range(1, 120000, ErrorMessage = "{0} não pode ser menor que 1 e maior que 120.000")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (gif, jpg, bmp, pngP)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "{0} é obrigatório")]
        [Phone(ErrorMessage = "{0} inválido")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "{0} é obrigatório")]
        [Display(Name = "E-mail")]
        [EmailAddress(ErrorMessage = "{0} inválido")]
        public string Email { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }

        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }

        public IEnumerable<PalestranteDto> PalestrantesEventos { get; set; }
    }
}