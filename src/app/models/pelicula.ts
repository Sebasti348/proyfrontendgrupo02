export class Pelicula {
    _id?: string;
    originalTitle: string;
    description: string;
    releaseDate: Date;
    trailer: string;
    primaryImage: string;

    // Constructor que acepta un objeto para facilitar el mapeo
    constructor(data?: any) {
        if (data) {
            this._id = data._id;
            this.originalTitle = data.originalTitle;
            this.description = data.description;
            this.releaseDate = data.releaseDate ? new Date(data.releaseDate) : new Date();
            this.trailer = data.trailer;
            this.primaryImage = data.primaryImage;
        } else {
            // Valores por defecto si no se pasa 'data'
            this.originalTitle = '';
            this.description = '';
            this.releaseDate = new Date();
            this.trailer = '';
            this.primaryImage = '';
        }
    }
}