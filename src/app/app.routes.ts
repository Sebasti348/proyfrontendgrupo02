import { Routes } from '@angular/router';
import { CrudusuariosComponent } from './components/crudusuarios/crudusuarios.component';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';
import { CarteleraComponent } from './components/cartelera/cartelera.component';
import { GestionPeliculasComponent } from './components/gestion-peliculas/gestion-peliculas.component';
import { GestionFuncionesComponent } from './components/gestion-funciones/gestion-funciones.component';
import { FuncionesComponent } from './components/funciones/funciones.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { PrincipalComponent } from './components/auditorvistas/principal/principal.component';
import { EstadisticasComponent } from './components/auditorvistas/estadisticas/estadisticas.component';
import { ReportesComponent } from './components/auditorvistas/reportes/reportes.component';

export const routes: Routes = [
    { path: 'usuarios', component: CrudusuariosComponent },
    { path:'',component: CarteleraComponent},
    {path: 'gestion-peliculas',component: GestionPeliculasComponent},
    {path: 'gestion-funciones',component: GestionFuncionesComponent},
    {path: 'funcion/activas',component: FuncionesComponent},
    {path: 'reservas',component: ReservasComponent},
    {path: 'reservas/:id',component: ReservasComponent},
    { path: 'usuarios', component: CrudusuariosComponent },
    { path: 'loginregister', component: LoginregisterComponent },
    { path: 'auditor', component: PrincipalComponent },
    { path: 'estadisticas', component: EstadisticasComponent },
    { path: 'reportes', component: ReportesComponent }

];
