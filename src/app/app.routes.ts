import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AddCircuitComponent } from './pages/add-circuit/add-circuit.component';
import { CircuitComponent } from './pages/circuit/circuit.component';

export const routes: Routes = [
    { path: '', component: AppComponent }, // Página inicial
    { path: 'add-circuit', component: AddCircuitComponent }, // Adicionar circuito
    { path: 'circuit/:id', component: CircuitComponent } // Executar circuito
];
