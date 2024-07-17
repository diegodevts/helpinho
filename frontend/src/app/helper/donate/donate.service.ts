import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DonateService {
  private modalStateSubject = new BehaviorSubject<boolean>(false)
  private modalDataSubject = new BehaviorSubject<string>('')

  modalState$ = this.modalStateSubject.asObservable()
  modalData$ = this.modalDataSubject.asObservable()

  openModal(data?: string) {
    if (data) {
      this.modalDataSubject.next(data)
    }
    this.modalStateSubject.next(true)
  }

  closeModal() {
    this.modalStateSubject.next(false)
    this.modalDataSubject.next('')
  }
}
