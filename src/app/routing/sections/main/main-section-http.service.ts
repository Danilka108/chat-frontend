import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { IDialog } from './interface/dialog.interface';

interface IGetDialogsResponse {
    httpStatus: number,
    message: string,
    data: IDialog[],
}

@Injectable()
export class MainSectionHttpService {
    constructor(
        private readonly authService: AuthService,
        private readonly httpClient: HttpClient,
    ) {}

    getDialogs() {
        return this.authService.authRequest((accessToken) => {
            return this.httpClient.get(`${environment.apiUrl}/dialog`, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            }).pipe(
                map((val) => {
                    const v = val as IGetDialogsResponse
                    return v.data
                }),
            )
        }).pipe(map(dialogs => {
            if (!dialogs) return []
            return dialogs
        }))
    }
}