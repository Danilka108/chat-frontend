import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface';

interface IMainStore {
    activeReceiverID: number | null,
    dialogs: IDialog[]
}

@Injectable({
    providedIn: 'root'
})
export class MainStore {
    private readonly store = new BehaviorSubject<IMainStore>({
        activeReceiverID: null,
        dialogs: [],
    })
    readonly store$ = this.store.asObservable()

    getActiveReceiverID$() {
        return this.store$.pipe(map(store => store.activeReceiverID))
    }

    setActiveReceiverID(activeReceiverID: number) {
        this.store.next({
            ...this.store.getValue(),
            activeReceiverID,
        })
    }

    getActiveReceiverID() {
        return this.store.getValue().activeReceiverID
    }

    getDialogs$() {
        return this.store$.pipe(map(store => store.dialogs))
    }

    getDialogs() {
        return this.store.getValue().dialogs
    }

    setDialogs(dialogs: IDialog[]) {
        this.store.next({
            ...this.store.getValue(),
            dialogs,
        })
    }

    // addDialog(dialog: IDialog) {
    //     this.store.next({
    //         ...this.store.getValue(),
    //         dialogs: this.store.getValue().dialogs.concat(dialog)
    //     })
    // }

    // removeDialog(receiverID: number) {
    //     this.store.next({
    //         ...this.store.getValue(),
    //         dialogs: this.store.getValue().dialogs.filter(key => key.receiverID !== receiverID)
    //     })
    // }
}