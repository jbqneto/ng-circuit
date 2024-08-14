import { DestroyRef } from "@angular/core";
import { Subject } from "rxjs";


export abstract class BaseComponent {
    protected destroyed = new Subject<void>();

    public constructor(destroyRef: DestroyRef) {
        destroyRef.onDestroy(() => {
            this.destroyed.next();
            this.destroyed.complete();
        });
    }
}