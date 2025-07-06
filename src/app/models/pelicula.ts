export class Pelicula {
    _id?: string;
    originalTitle: string;
    description: string;
    // Creo que releaseDate era Date pero lo cambié a string porque la API devuelve un string
    releaseDate: string;
    trailer: string;
    primaryImage: string;

    // Constructor de la clase Pelicula.
    // Permite crear una instancia de Pelicula, ya sea inicializándola con datos existentes (ej. de una API o BD) o creando una instancia vacía con valores por defecto.
    constructor(data?: any) {
        // Comprueba si se proporcionaron datos al constructor.
        if (data) {
            // Si se proporcionan datos, se asignan las propiedades de la instancia de Pelicula
            // con los valores correspondientes del objeto 'data'.
            this._id = data._id; // Asigna el ID (si existe)
            this.originalTitle = data.originalTitle; // Asigna el título original
            this.description = data.description; // Asigna la descripción
            this.releaseDate = data.releaseDate; // Asigna la fecha de lanzamiento
            this.trailer = data.trailer; // Asigna la URL del trailer
            this.primaryImage = data.primaryImage; // Asigna la URL de la imagen principal
        } else {
            // Si no se proporcionan datos (es decir, se crea una nueva película sin valores iniciales),
            // se inicializan todas las propiedades con cadenas vacías.
            this.originalTitle = '';
            this.description = '';
            this.releaseDate = '';
            this.trailer = '';
            this.primaryImage = '';
        }
    }
}