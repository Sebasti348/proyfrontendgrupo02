import { Routes } from '@angular/router';
import { CrudusuariosComponent } from './components/crudusuarios/crudusuarios.component';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    { path: 'usuarios', component: CrudusuariosComponent },
    { path: '', component: LoginregisterComponent },
    {path:'main', component: MainComponent}
];
