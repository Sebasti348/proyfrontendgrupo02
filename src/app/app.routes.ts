import { Routes } from '@angular/router';
import { CrudusuariosComponent } from './components/crudusuarios/crudusuarios.component';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';
import { MainComponent } from './components/main/main.component';
import { PrincipalComponent } from './components/auditorvistas/principal/principal.component';
import { EstadisticasComponent } from './components/auditorvistas/estadisticas/estadisticas.component';
import { ReportesComponent } from './components/auditorvistas/reportes/reportes.component';

export const routes: Routes = [
    { path: 'usuarios', component: CrudusuariosComponent },
    { path: 'loginregister', component: LoginregisterComponent },
    { path: 'main', component: MainComponent },
    { path: 'auditor', component: PrincipalComponent },
    { path: 'estadisticas', component: EstadisticasComponent },
    { path: 'reportes', component: ReportesComponent }
];
