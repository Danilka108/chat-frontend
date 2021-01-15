import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface';

interface IMainStore {
    activeReceiverID: number | null,
    dialogs: IDialog[]
}

@Injectable({
    providedIn: 'root'
})
export class MainStore {
    private readonly main = new BehaviorSubject<IMainStore>({
        activeReceiverID: null,
        dialogs: [],
    })
    readonly main$ = this.main.asObservable()

    setActiveReceiverID(activeReceiverID: number) {
        this.main.next({
            ...this.main.getValue(),
            activeReceiverID,
        })
    }

    getActiveReceiverID() {
        return this.main.getValue().activeReceiverID
    }

    setDialogs(dialogs: IDialog[]) {
        this.main.next({
            ...this.main.getValue(),
            dialogs,
        })
    }

    addDialog(dialog: IDialog) {
        this.main.next({
            ...this.main.getValue(),
            dialogs: this.main.getValue().dialogs.concat(dialog)
        })
    }

    removeDialog(receiverID: number) {
        this.main.next({
            ...this.main.getValue(),
            dialogs: this.main.getValue().dialogs.filter(key => key.receiverID !== receiverID)
        })
    }
}