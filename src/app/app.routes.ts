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
import { ListaReservasComponent } from './components/lista-reservas/lista-reservas.component';
import { AuthGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/not-auth.guard';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { PerfilusuarioComponent } from './components/perfilusuario/perfilusuario.component';

export const routes: Routes = [
    { path: 'gestion-usuarios', component: CrudusuariosComponent, canActivate: [AuthGuard], data: { roles: ['root'] } },
    { path: 'perfil', component: PerfilusuarioComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
    { path:'',component: CarteleraComponent},
    {path: 'gestion-peliculas',component: GestionPeliculasComponent, canActivate: [AuthGuard], data: { roles: ['administrador'] } },
    {path: 'gestion-funciones',component: GestionFuncionesComponent, canActivate: [AuthGuard], data: { roles: ['administrador'] } },
    {path: 'funcion/activas',component: FuncionesComponent },
    {path: 'lista-reservas',component: ListaReservasComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'] } },
    {path: 'reservas/:id',component: ReservasComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
    { path: 'loginregister', component: LoginregisterComponent, canActivate: [notAuthGuard] },
    { path: 'auditor', component: PrincipalComponent , canActivate: [AuthGuard], data: { roles: ['auditor'] }},
    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard], data: { roles: ['auditor'] } },
    { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard], data: { roles: ['auditor'] } },
    { path: 'access-denied', component:AccessDeniedComponent}
];
