import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SessionErrorService {
    private readonly errorSubject = new Subject<void>()
    private readonly error$ = this.errorSubject.asObservable()

    emit() {
        this.errorSubject.next()
    }

    get() {
        return this.error$
    }
}
