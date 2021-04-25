/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NgModule } from '@angular/core'
import { StorageTypeService } from './storage-type.service'
import { StorageService } from './storage.service'

@NgModule({
    providers: [StorageTypeService, StorageService],
})
export class StorageModule {}
