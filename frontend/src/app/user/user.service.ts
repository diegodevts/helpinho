import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Helper } from '../../../../backend/src/types'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = new BehaviorSubject<any>({})
  selecteduser = this.user.asObservable()

  constructor() {}

  setUser(user: any) {
    this.user.next(user)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }

  logout(): void {
    localStorage.removeItem('token')
  }
}
