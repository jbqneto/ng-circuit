import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { inject as analytics } from '@vercel/analytics';
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
  repetition: number;
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
  public selectedExcercise: SelectItem | null = null;

  private notificationPermission: NotificationPermission | null = null;
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
    this.notificationPermission = Notification.permission;
    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    };

    this.timerService.onTimeChange()
      .pipe(
        takeUntil(this.destroyed)
      ).subscribe((time) => {
        this.timeLeft = time;
        this.elapsedTime = this.elapsedTime + 1;

        if (this.timeLeft === 0 && this.currentPosition) {
          this.isPlaying = false;
          this.nextExcercise(this.currentPosition);
        } else {
          this.updateChart();
        }

      });

    analytics();

  }
  nextExcercise(positions: Positions) {
    const rowPos = positions.row;
    const currentRow = positions.row;
    const excercisePos = positions.exercise;

    let nextExcercise;
    let nextRow;

    if (!this.currentCircuit) return;

    const row = this.currentCircuit.rows.at(currentRow);

    if (!row) return;

    let repetition = positions.repetition;

    const isLastRow = rowPos === this.currentCircuit.rows.length - 1;
    const isLastExercise = excercisePos === row.exercises.length - 1;
    const isLastRound = repetition === row.repetitions;

    //FIM
    if (isLastRound && isLastExercise && isLastRow) {
      return this.endCircuit();
    }

    if (!isLastExercise) {
      nextRow = rowPos;
      nextExcercise = excercisePos + 1;
    } else if (isLastExercise && repetition < row.repetitions) {
      repetition += 1;
      nextExcercise = 0;
      nextRow = rowPos;
    } else if (isLastExercise && repetition === row.repetitions) {
      nextRow = rowPos + 1;
      nextExcercise = 0;
      repetition = 1;
    }

    this.updateCurrentCircuit({
      circuit: positions.circuit,
      exercise: nextExcercise ?? excercisePos,
      row: nextRow ?? rowPos,
      repetition,
    });

  }

  private endCircuit() {

  }

  private updateCurrentCircuit(positions: Positions) {
    const circuit = this._circuits.at(positions.circuit);

    console.log("updating positions: ", positions);

    if (!circuit) return;

    const row = circuit.rows.at(positions.row);

    if (!row) return;

    const exercise = row.exercises.at(positions.exercise);

    if (!exercise) return;

    const autoPlay = this.exercise !== null;

    if (this.exercise) {
      this.notify(exercise, this.exercise);
    }

    this.currentPosition = positions;
    this.currentCircuit = circuit;
    this.exercise = exercise;

    this.currentRow = row;

    this.selectedExcercise = {
      code: positions.exercise,
      name: exercise.walking?.title ?? '' + ' (' + positions.repetition + ')'
    };

    this.circuitTime = circuit.rows.reduce((sum, row) => {
      return sum + row.getTotalTiming();
    }, 0);

    this.timeLeft = this.exercise?.getDuration() ?? 0;

    if (autoPlay) {
      setTimeout(() => {
        this.playTimer();
      }, 100);
    }
  }

  public requestNotificationPermission(): Promise<boolean> {

    return new Promise((resolve, reject) => {
      Notification.requestPermission().then(permission => {
        this.notificationPermission = permission;

        if (permission === 'granted') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

  }

  private notify(nextExcercise: Exercise | null, prevExcercise: Exercise | null): void {
    const next = nextExcercise?.walking?.title ?? 'exercício';
    const prev = prevExcercise?.walking?.title ?? '';
    const title = prev === '' ? 'Iniciando os exercícios' : `Fim de ${prev}`;
    let body = 'Começando ' + next;

    this.playEffect('alarm');

    if (prevExcercise) {
      this.playTextVoice(body);
    }

    if (!nextExcercise) {
      body = 'Fim do circuito';
      this.playTextVoice(body);
    }

    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, {
            body
          });
        }
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(500);
      navigator.vibrate(300);
      navigator.vibrate(100);
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

    const currentData = this.chart.data.datasets[0].data[1];

    this.chart.data.datasets[0].data[1] = currentData - this.elapsedTime;
    this.chart.data.datasets[0].data[1] = this.elapsedTime;

    this.chart.refresh();
  }
  public onRowSelect(evt: any) {
    console.log("row selected: ", evt);
  }

  public onCircuitSelected(evt: DropdownChangeEvent) {
    const index = evt.value;
    this.isPlaying = false;

    this.updateCurrentCircuit({
      circuit: index,
      exercise: 0,
      row: 0,
      repetition: 1
    });

    if (!this.currentCircuit) return;

    this.timeTotal = this.currentCircuit.rows.reduce((sum, current) => {
      return sum + current.getTotalTiming();
    }, 0);

    this.data = this.createChart(this.timeTotal);
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
    this.playEffect('click');

    const actToggle = () => {
      if (this.isPlaying) {
        this.pauseTimer();
      } else {
        this.playTimer();
      }
    };

    if (!this.notificationPermission || this.notificationPermission !== 'granted') {
      this.requestNotificationPermission()
        .then((res) => {
          if (res) {
            new Notification('Notificações habilitadas!', { silent: false });
          }
          actToggle();
        })
    } else {
      actToggle();
    }
  }

  private playTextVoice(text: string) {
    const message = new SpeechSynthesisUtterance();

    // set the text to be spoken
    message.text = text;

    // create an instance of the speech synthesis object
    const speechSynthesis = window.speechSynthesis;

    // start speaking
    speechSynthesis.speak(message);
  }

  private playEffect(effect: EffectTitle) {
    const audio = effectMap.get(effect);

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

    this.isPlaying = true;

    if (!this.timerService.isStarted()) {
      this.timerService.startNewTimer(this.exercise.getDuration());
    } else {
      this.timerService.continueTimer();
    }
  }

  pauseTimer() {
    this.isPlaying = false;
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
