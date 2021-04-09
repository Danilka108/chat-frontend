import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SessionErrorService {
    private readonly errorSubject = new Subject<void>()
    private readonly error$ = this.errorSubject.asObservable()

    emit(): void {
        this.errorSubject.next()
    }

    get(): Observable<void> {
        return this.error$
    }
}
