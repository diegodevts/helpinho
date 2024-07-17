import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { DonateService } from './donate.service'
import { HttpService } from '../../http/http.service'

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css'
})
export class DonateComponent implements OnInit {
  constructor(private modalService: DonateService, private http: HttpService) {}
  value!: number
  isOpen: boolean = false
  userDonation!: string

  ngOnInit() {
    this.modalService.modalState$.subscribe((state: boolean) => {
      console.log(state)
      this.isOpen = state
    })

    this.modalService.modalData$.subscribe((data: string) => {
      this.userDonation = data
    })
  }

  cancel() {
    this.modalService.closeModal()
  }

  sendDonation() {
    this.http.donateHelper(this.value.toString(), this.userDonation).subscribe(
      (data) => {
        console.log(data)
      },
      (err) => console.log(err)
    )

    this.modalService.closeModal()
  }
}