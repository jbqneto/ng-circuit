import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { interval } from 'rxjs';
import { DAYS_CIRCUITS, Exercise, ExerciseRow } from '../../models/models';
import { SharedModule } from '../../shared/shared.module';

type SelectCircuit = {
  name: string;
  code: number
}

@Component({
  selector: 'app-circuit',
  standalone: true,
  imports: [SharedModule, DropdownModule],
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.scss'
})
export class CircuitComponent implements OnInit {
  private audio = new Audio();
  private _circuits = DAYS_CIRCUITS;
  public isPlaying = false;
  public data: any;
  public options: any;
  private interval$: any;
  public timeLeft: number = 0;
  public selectedCircuit: SelectCircuit | null = null;
  public currentRow: ExerciseRow | null = null;
  public exercise: Exercise | null = null;

  public constructor() {
    this.audio.src = 'assets/audio/bell.wav';
  }

  public ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['elapsed', 'missing'],
      datasets: [
        {
          data: [10, 100],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    };

  }

  public get icon(): string {
    if (!this.isPlaying) {
      return 'pi pi-play';
    } else {
      return 'pi pi-pause';
    }
  }

  public get circuits(): any[] {
    return this._circuits.map((circ, index) => ({
      name: circ.name,
      code: index
    }));
  }

  public get timing(): string {
    if (this.exercise === null) {
      return "00:00";
    } else {
      return "";
    }
  }

  public togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  startTimer() {
    this.interval$ = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.playAlarm();
        // Iniciar o próximo exercício ou finalizar o circuito
        this.interval$.unsubscribe();
      }
    });
  }

  playAlarm() {
    this.audio.play();
    navigator.vibrate(200); // Vibrar por 200ms
  }
}
