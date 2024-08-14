import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private worker: Worker;
    private timer$ = new Subject<number>();

    public constructor() {
        this.worker = new Worker('assets/script/timer.worker.ts');
        this.worker.onmessage = (event) => {
            if (event.data.message === 'timeUp') {
                console.log('Tempo acabou!');
                // Aqui você pode disparar uma notificação, vibração, etc.
            } else {
                console.log('Tempo restante:', event.data.timeLeft);
            }
        };
    }

    public startNewTimer(timeInSecs: number) {

    }

    public onTimeChange(): Observable<number> {
        return this.timer$.asObservable();
    }

}