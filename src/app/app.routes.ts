import { Routes } from '@angular/router';
import { AddCircuitComponent } from './pages/add-circuit/add-circuit.component';
import { CircuitComponent } from './pages/circuit/circuit.component';

export const routes: Routes = [
    { path: '', redirectTo: 'circuit', pathMatch: 'full' }, // Página inicial
    { path: 'add-circuit', component: AddCircuitComponent }, // Adicionar circuito
    { path: 'circuit', component: CircuitComponent } // Executar circuito
];
