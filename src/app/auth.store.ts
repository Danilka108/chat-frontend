import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IAuthStore {
  userID: number | null,
  accessToken: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly auth = new BehaviorSubject<IAuthStore>({
    userID: null,
    accessToken: null
  })
  readonly auth$ = this.auth.asObservable()

  constructor() { }

  setUserID(userID: number) {
    this.auth.next({
      ...this.auth.getValue(),
      userID
    })
  }

  getUserID() {
    return this.auth.getValue().userID
  }

  setAccessToken(accessToken: string) {
    this.auth.next({
      ...this.auth.getValue(),
      accessToken,
    })
  }

  getAccessToken() {
    return this.auth.getValue().accessToken
  }
}
