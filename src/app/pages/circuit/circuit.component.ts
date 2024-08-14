import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../base.component';
import { Circuit, DAYS_CIRCUITS, Exercise, ExerciseRow } from '../../models/models';
import { TimerService } from '../../service/timer.service';
import { SharedModule } from '../../shared/shared.module';

type SelectItem = {
  name: string;
  code: number
}

type Positions = {
  circuit: number;
  row: number;
  exercise: number
}

type EffectTitle = 'click' | 'alarm';

const effectMap = new Map<EffectTitle, string>();
effectMap.set('alarm', 'assets/audio/bell.wav');
effectMap.set('click', 'assets/audio/tick.wav');


@Component({
  selector: 'app-circuit',
  standalone: true,
  imports: [SharedModule, DropdownModule, ListboxModule],
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.scss'
})
export class CircuitComponent extends BaseComponent implements OnInit {

  public isPlaying = false;
  public data: any;
  public options: any;
  public timeLeft: number = 0;
  public timeTotal: number = 0;
  public circuitTime: number = 0;
  public elapsedTime: number = 0;
  public selectedCircuit: SelectItem | null = null;
  public currentRow: ExerciseRow | null = null;
  public exercise: Exercise | null = null;
  public currentExercise: SelectItem | null = null;

  private currentPosition: Positions | null = null;
  private player: HTMLAudioElement;
  private _circuits = DAYS_CIRCUITS;
  public currentCircuit: Circuit | null = null;

  @ViewChild('chart')
  public chart: UIChart | undefined;

  public constructor(private timerService: TimerService) {
    super(inject(DestroyRef));
    this.player = new Audio();
    this.player.volume = 1;
  }

  public ngOnInit(): void {

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    };

    if (this.chart) {
      console.log(this.chart.data);
    }

    this.timerService.onTimeChange()
      .pipe(
        takeUntil(this.destroyed)
      ).subscribe((time) => {
        this.timeLeft = time;
        this.elapsedTime = this.elapsedTime + 1;

        if (this.timeLeft === 0 && this.currentPosition) {
          this.notify();
          this.nextExcercise(this.currentPosition);
        } else {
          this.updateChart();
        }

      })

  }
  nextExcercise(positions: Positions) {
    const rowPos = positions.row;
    const currentRow = positions.row;
    const excercisePos = positions.exercise;

    if (!this.currentCircuit) return;

    const row = this.currentCircuit.rows.at(currentRow);

    if (!row) return;

    if (currentRow < row.exercises.length - 1) {

    }

    if (this.currentCircuit.rows.length - 1 < rowPos) {
      this.currentPosition = {
        circuit: positions.circuit,
        exercise: positions.exercise,
        row: positions.row + 1
      }
    }

    this.updateCurrentCircuit(positions);

  }
  private updateCurrentCircuit(positions: Positions) {
    const circuit = this._circuits.at(positions.circuit);

    if (!circuit) return;

    this.currentPosition = positions;

    this.currentCircuit = circuit;
    this.circuitTime = circuit.rows.reduce((sum, row) => {
      return sum + row.getTotalTiming();
    }, 0);

    this.currentRow = circuit.rows[0] ?? null;

    if (!this.currentRow) return;

    this.exercise = this.currentRow.exercises.at(0) ?? null;

    if (!this.exercise) return;

    this.currentExercise = {
      code: 0,
      name: this.exercise?.walking?.title ?? ''
    };

    this.timeLeft = this.exercise?.getDuration() ?? 0;

    this.timeTotal = circuit.rows.reduce((sum, current) => {
      return sum + current.getTotalTiming();
    }, 0);
  }

  private notify(): void {
    const circuit = this.currentCircuit;

    this.playEffect('alarm');

    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification('Tempo Acabou!', {
            body: 'Começando o próximo: '
          });
        }
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(200); // Vibra por 200ms
    }
  }

  private createChart(timeTotal: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
      labels: ['elapsed', 'missing'],
      datasets: [
        {
          data: [timeTotal, 1],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    }
  }

  updateChart(): any {
    if (!this.chart) return;

    this.chart.data.datasets[0].data[1] = this.elapsedTime;

    this.chart.refresh();
  }
  public onRowSelect(evt: any) {
    console.log("row selected: ", evt);
  }

  public onCircuitSelected(evt: DropdownChangeEvent) {
    const index = evt.value;

    this.updateCurrentCircuit({
      circuit: index,
      exercise: 0,
      row: 0
    });


    this.data = this.createChart(this.timeTotal);
  }

  private startExercise(exercise: Exercise) {
    this.timerService.startNewTimer(exercise.getDuration());
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

  public get exercises(): SelectItem[] {
    if (!this.currentCircuit) return [];

    const exercise = this.currentExercise

    return this.currentCircuit.rows.map((row, index) => ({
      code: index,
      name: row.title
    }));
  }

  public get timing(): string {
    if (this.timeLeft === 0) {
      return "00:00";
    } else {
      return this.formatTiming(this.timeLeft);
    }
  }

  public get title(): string {
    if (!this.exercise) return '';

    return `${this.exercise.walking?.title}`
  }

  public togglePlay() {
    this.isPlaying = !this.isPlaying;

    this.playEffect('click');

    if (!this.isPlaying) {
      this.pauseTimer();
    } else {
      this.playTimer();
    }
  }

  private playEffect(effect: EffectTitle) {
    const audio = effectMap.get(effect);

    console.log("audio: ", audio);

    if (audio) {
      this.player.src = audio;
      this.player.load();
      this.player.play()
        .then(() => console.log("played"))
        .catch(e => console.warn("not played", e));

      this.player.addEventListener('canplaythrough', (evt) => {
        console.log("player tru", evt);
      });
    }
  }

  playTimer() {
    if (!this.exercise) return;

    if (this.timeLeft === this.exercise.getDuration()) {
      this.timerService.startNewTimer(this.exercise.getDuration());
    } else {
      this.timerService.continueTimer();
    }
  }

  pauseTimer() {
    this.timerService.pauseTimer();
  }

  playAlarm() {
    this.player.play();
    navigator.vibrate(200); // Vibrar por 200ms
  }

  formatTiming(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
  }

}
