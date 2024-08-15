import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private worker: Worker;
    private timeLeft: number = 0;
    private paused = false;
    private timer$ = new Subject<number>();

    public constructor() {
        this.worker = new Worker('assets/script/timer.worker.js');
        this.worker.onmessage = (event) => {
            if (event.data.timeLeft !== undefined && !this.paused) {
                this.timeLeft = event.data.timeLeft;
                this.timer$.next(event.data.timeLeft);
            }
        };
    }

    public startNewTimer(timeInSecs: number) {
        this.timeLeft = timeInSecs;
        this.worker.postMessage({ duration: timeInSecs });
    }

    public isStarted() {
        return this.timeLeft > 0;
    }

    pauseTimer() {
        this.paused = true;
        console.log("should pause: " + this.timeLeft);
        this.worker.postMessage({ pause: true });
    }

    continueTimer() {
        this.paused = false;
        console.log("should continue: " + this.timeLeft);
        this.worker.postMessage({ paused: false, duration: this.timeLeft });
    }

    public onTimeChange(): Observable<number> {
        return this.timer$.asObservable();
    }

}