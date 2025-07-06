import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pelicula } from '../../models/pelicula';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera.component.html',
  styleUrl: './cartelera.component.css'
})

export class CarteleraComponent implements OnInit {

  peliculas: Pelicula[] = [];
  proximas: any[] = [];
  trailerEmbedUrl: SafeResourceUrl | null = null;
  tituloPeliSeleccionada: string = '';
  descripcionPeliSeleccionada: string = '';
  moviesPerSlide: number = 3;

  constructor(
    private router: Router,
    private peliculaService: PeliculasService,
    private sanitizer: DomSanitizer // Inyección del servicio DomSanitizer para la seguridad de URLs
  ) { }

  ngOnInit(): void {
    this.mostrarCartelera();
    //Descomentar para la presentación
    //this.verProximosEstrenos(); // Descomentar para cargar también los próximos estrenos (posiblemente para una presentación)
  }

  // Método para obtener y mostrar las películas de cartelera
  mostrarCartelera() {
    this.peliculaService.getPeliculas().subscribe(
      result => {
        this.peliculas = result;
        console.log(this.peliculas);
      },
      error => {
        console.error('Error al obtener películas:', error);
      }
    );
  }

  // Método para agrupar las películas en "slides" para el carrusel
  verCarruselPeliculas(): Pelicula[][] {
    const groups: Pelicula[][] = []; // Array para almacenar los grupos de películas
    // Itera sobre las películas y las agrupa según 'moviesPerSlide'
    for (let i = 0; i < this.peliculas.length; i += this.moviesPerSlide) {
      groups.push(this.peliculas.slice(i, i + this.moviesPerSlide)); // Agrega un sub-array de películas al grupo
    }
    return groups;
  }


  verFuncionesPorNombre(nombrePelicula: string) {
    if (nombrePelicula) {
      this.router.navigate(['funciones', nombrePelicula]);
    } else {
      console.error('No se seleccionó ninguna función');
    }
  }

  // Método para obtener y mostrar los próximos estrenos
  verProximosEstrenos() {
    this.peliculaService.getNextMovies().subscribe(
      (result: { [key: string]: { date: string, titles: any[] } }) => {
        let todasLasPeliculas: any[] = []; // Array temporal para almacenar todas las películas
        // Itera sobre el objeto de resultados para extraer todas las películas por fecha
        for (const key in result) {
          if (Object.prototype.hasOwnProperty.call(result, key)) {
            const peliculasPorFecha = result[key].titles; // Obtiene las películas para la fecha actual
            todasLasPeliculas = todasLasPeliculas.concat(peliculasPorFecha); // Concatena las películas al array temporal
          }
        }
        // Filtra las películas para asegurarse de que tengan una imagen principal
        this.proximas = todasLasPeliculas.filter(pelicula =>
          pelicula.primaryImage && pelicula.primaryImage
        );

        console.log('Películas próximas', this.proximas); // Muestra las próximas películas en consola
      },
      error => {
        console.error('Error al obtener películas próximas:', error);
      }
    );
  }

  // Método para obtener una descripción corta de una película
  getShortDescription(description: string | null | undefined, limit: number = 250): string {
    if (!description) {
      return 'Descripción no disponible.';
    }
    if (description.length <= limit) {
      return description;
    }
    return description.substring(0, limit) + '...'; // Corta la descripción y añade puntos suspensivos
  }

  // Método para establecer el título y la descripción de la película seleccionada para la sinopsis
  setSelectedSinopsis(title: string | null | undefined, description: string | null | undefined): void {
    this.tituloPeliSeleccionada = title || 'Sinopsis no disponible';
    this.descripcionPeliSeleccionada = description || 'Lo sentimos, la sinopsis para esta película no se encuentra disponible.';
  }

    verFunciones() {
      this.router.navigate(['funcion/activas']);
    }

    // Método para mostrar el trailer de una película en un modal
    verTrailer(trailerUrl: string) {
      if (trailerUrl) {
        const embedUrl = this.convertirYoutubeEmbed(trailerUrl); // Convierte la URL de YouTube a un formato de incrustación
        this.trailerEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl); // Sanitiza la URL para incrustarla de forma segura
      } else {
        console.warn('No hay URL de trailer disponible para esta película.');
      }
    }

    cerrarModal() {
      this.trailerEmbedUrl = null;
    }

    // Decorador @HostListener para escuchar eventos del teclado (Escape)
    @HostListener('document:keydown.escape', ['$event'])
    cerrarConEsc() {
      this.cerrarModal(); // Llama a cerrarModal cuando se presiona la tecla Escape
    }

    // Método para convertir una URL de YouTube en una URL de incrustación (embed)
    convertirYoutubeEmbed(url: string): string {
      // Expresión regular para extraer el ID del video de una URL de YouTube
      const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
      // Extrae el ID del video si se encuentra, de lo contrario, una cadena vacía
      const videoId = match && match[1] ? match[1] : '';
      // Retorna la URL de incrustación de YouTube con el autoplay activado (hay un pequeño error en la URL original: '0{videoId}' en lugar de '${videoId}')
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Corrección de la URL de incrustación
    }

  }
