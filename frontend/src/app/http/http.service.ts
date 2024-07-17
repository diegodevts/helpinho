import { HelperDto } from './../../../../shared/dtos/helper/helper.dto'
import { Helper, User } from './../../../../backend/src/types/index.d'
import { UserDto } from './../../../../shared/dtos/user/user.dto'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { UserService } from '../user/user.service'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  createUser(user: UserDto): Observable<void> {
    return this.http
      .post<void>(this.apiUrl + '/users', user)
      .pipe(catchError(this.handleError))
  }

  login(user: {
    email: string
    password: string
  }): Observable<{ token: string; user: { email: string; name: string } }> {
    return this.http
      .post<{ token: string; user: { email: string; name: string } }>(
        this.apiUrl + '/user/login',
        user
      )
      .pipe(catchError(this.handleError))
  }

  getUser(id: string): Observable<User> {
    const url = `${this.apiUrl}/user/${id}`
    const token = localStorage.getItem('token')
    return this.http
      .get<User>(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    const url = `${this.apiUrl}/user/${id}`
    const token = localStorage.getItem('token')
    return this.http
      .put<User>(url, user, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  deleteUser(id: string): Observable<void> {
    const url = `${this.apiUrl}/user/${id}`
    const token = localStorage.getItem('token')
    return this.http
      .delete<void>(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  createHelper(helper: Omit<HelperDto, 'userId'>): Observable<Helper | any> {
    const token = localStorage.getItem('token')
    return this.http
      .post<Helper>(this.apiUrl + '/helper', helper, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }
  getHelper(id: string): Observable<Helper> {
    const token = localStorage.getItem('token')
    const url = `${this.apiUrl}/helper/${id}`
    return this.http
      .get<Helper>(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  updateHelper(id: string, helper: Partial<Helper>): Observable<Helper> {
    const token = localStorage.getItem('token')
    const url = `${this.apiUrl}/helper/${id}`

    return this.http
      .put<Helper>(url, helper, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  deleteHelper(id: string): Observable<void> {
    const token = localStorage.getItem('token')
    const url = `${this.apiUrl}/helper/${id}`
    return this.http
      .delete<void>(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .pipe(catchError(this.handleError))
  }

  getHelpers(take?: number): Observable<{ helpers: Helper[] }> {
    const token = localStorage.getItem('token')
    return this.http
      .get<{ helpers: Helper[] }>(
        this.apiUrl + '/helpers?take=' + take?.toString(),
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .pipe(catchError(this.handleError))
  }

  donateHelper(value: string, id: string): Observable<Helper[]> {
    const token = localStorage.getItem('token')
    return this.http
      .post<Helper[]>(
        this.apiUrl + '/helper/donate',
        { value, id },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error'
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`
    } else {
      errorMessage = `Erro ${error.status}: ${error.error.message}`
    }

    return throwError(errorMessage)
  }
}
