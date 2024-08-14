import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedModule } from '../../shared/shared.module';
@Component({
  selector: 'app-add-circuit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-circuit.component.html',
  styleUrl: './add-circuit.component.scss'
})
export class AddCircuitComponent {
  items: MenuItem[] = [];

}
