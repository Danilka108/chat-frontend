import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

interface IGetDialogsResponse {
    httpStatus: number,
    message: string,
    data: IDialog[],
}

export interface IDialog {
    receiverID: number,
    receiverName: string,
    latestMessage: string,
    createdAt: string,
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
        })
    }
}