/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subject, Subscription } from 'rxjs'
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators'
import { selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { HttpService } from '../../services/http.service'
import { SearchService } from '../../services/search.service'

@Component({
    selector: 'app-dialogs-search-input',
    templateUrl: './dialogs-search-input.component.html',
    styleUrls: ['./dialogs-search-input.component.scss'],
})
export class DialogsSearchInputComponent implements OnInit, OnDestroy {
    inputValue = ''

    input = new Subject<void>()
    input$ = this.input.asObservable()

    subscription = new Subscription()

    isDarkTheme$!: Observable<boolean>

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(
        private readonly store: Store<AppState>,
        private readonly httpService: HttpService,
        private readonly searchService: SearchService
    ) {}

    ngOnInit(): void {
        this.isDarkTheme$ = this.store.select(selectIsDarkTheme)

        this.sub = this.searchService
            .getClear()
            .pipe(
                tap(() => {
                    this.inputValue = ''
                    this.input.next()
                })
            )
            .subscribe()

        this.sub = this.input$
            .pipe(
                filter(() => {
                    if (this.inputValue.length === 0) this.searchService.emitIsView(false)
                    return this.inputValue.length !== 0
                }),
                debounceTime(300),
                switchMap(() => this.httpService.searchUsers(this.inputValue)),
                tap((users) => {
                    if (users !== null && this.inputValue.length !== 0) {
                        this.searchService.emitSearchData(users)
                        this.searchService.emitIsView(true)
                    } else this.searchService.emitIsView(false)
                })
            )
            .subscribe()
    }

    onInput(): void {
        this.input.next()
    }

    clearValue(): void {
        this.inputValue = ''
        this.input.next()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
