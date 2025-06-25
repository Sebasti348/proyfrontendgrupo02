import { Routes } from '@angular/router';
import { CrudusuariosComponent } from './components/crudusuarios/crudusuarios.component';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';

export const routes: Routes = [
    { path: 'crudusuarios', component: CrudusuariosComponent },
    { path: 'loginregister', component: LoginregisterComponent }
];
