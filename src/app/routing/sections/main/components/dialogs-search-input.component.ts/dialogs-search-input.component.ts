/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators'
import { MainHttpService } from '../../services/main-http.service'
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

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(private readonly httpService: MainHttpService, private readonly searchService: SearchService) {}

    ngOnInit(): void {
        this.sub = this.input$
            .pipe(
                filter(() => {
                    if (this.inputValue.length === 0) this.searchService.emitIsView(false)
                    return this.inputValue.length !== 0
                }),
                debounceTime(300),
                switchMap(() => this.httpService.searchUsers(this.inputValue)),
                tap((users) => {
                    if (users !== null) {
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
