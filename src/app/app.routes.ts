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
import { PagoExitosoComponent } from './components/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './components/pago-fallido/pago-fallido.component';
import { PagoPendienteComponent } from './components/pago-pendiente/pago-pendiente.component';

export const routes: Routes = [
    { path: 'gestion-usuarios', component: CrudusuariosComponent, canActivate: [AuthGuard], data: { roles: ['root'] } },
    { path: 'perfil', component: PerfilusuarioComponent, canActivate: [AuthGuard], data: { roles: ['cliente' , 'root'] } },
    { path:'',component: CarteleraComponent},
    {path: 'gestion-peliculas',component: GestionPeliculasComponent, canActivate: [AuthGuard], data: { roles: ['administrador', 'root'] } },
    {path: 'gestion-funciones',component: GestionFuncionesComponent, canActivate: [AuthGuard], data: { roles: ['administrador', 'root'] } },
      //Funciones Activas
    {path: 'funcion/activas',component: FuncionesComponent },
      //Funciones por Nombre de Película
    { path: 'funciones/:nombrePelicula', component: FuncionesComponent },
    {path: 'lista-reservas',component: ListaReservasComponent, canActivate: [AuthGuard], data: { roles: ['supervisor', 'root'] } },
      //Reserva de Funciones por ID
    {path: 'reservas/:id',component: ReservasComponent, canActivate: [AuthGuard], data: { roles: ['cliente', 'root'] } },
    { path: 'loginregister', component: LoginregisterComponent, canActivate: [notAuthGuard] },
    { path: 'auditor', component: PrincipalComponent , canActivate: [AuthGuard], data: { roles: ['auditor', 'root'] }},
    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard], data: { roles: ['auditor', 'root'] } },
    { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard], data: { roles: ['auditor', 'root'] } },
      //Rutas de Pago, solo exitoso tiene contenido extra
    { path: 'access-denied', component:AccessDeniedComponent},
    { path: 'pago/exitoso', component: PagoExitosoComponent },
    { path: 'pago/fallido', component: PagoFallidoComponent },
    { path: 'pago/pendiente', component: PagoPendienteComponent },
];
