import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { ReducersMap } from './interfaces/reducers-map.type'
import { Store } from './store'
import { storeFactory } from './store.factory'

@NgModule({})
export class StoreCoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreCoreModule) {
        if (parentModule) throw new Error('StoreModule is already loaded. Import it in AppModule only!')
    }

    static forRoot<StateType>(
        initialState: StateType,
        reducers: ReducersMap<StateType>
    ): ModuleWithProviders<StoreCoreModule> {
        return {
            ngModule: StoreCoreModule,
            providers: [
                {
                    provide: Store,
                    useFactory: storeFactory(reducers, initialState),
                },
            ],
        }
    }
}
