import { Component } from '@angular/core';
import { CIRCUIT_LIST } from '../../models/models';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-circuit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.scss'
})
export class CircuitComponent {
  private audio = new Audio();
  public circuits = CIRCUIT_LIST;

  public constructor() {
    this.audio.src = 'assets/sounds/alarm.mp3';
  }

  playAlarm() {
    this.audio.play();
    navigator.vibrate(200); // Vibrar por 200ms
  }
}
