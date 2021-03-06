import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { ISearchUser } from '../interface/search-user.interface'

@Injectable()
export class SearchService {
    private readonly searchData = new Subject<ISearchUser[]>()
    private readonly isView = new Subject<boolean>()
    private readonly clear = new Subject<void>()

    emitClear(): void {
        this.clear.next()
    }

    getClear(): Observable<void> {
        return this.clear.asObservable()
    }

    emitSearchData(data: ISearchUser[]): void {
        this.searchData.next(data)
    }

    getSearchData(): Observable<ISearchUser[]> {
        return this.searchData.asObservable()
    }

    emitIsView(isView: boolean): void {
        this.isView.next(isView)
    }

    getIsView(): Observable<boolean> {
        return this.isView.asObservable()
    }
}
