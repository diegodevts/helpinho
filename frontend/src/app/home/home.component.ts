import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'
import { UserService } from '../user/user.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpService } from '../http/http.service'
import { Helper } from '../../../../backend/src/types'
import { DonateComponent } from '../helper/donate/donate.component'
import { DonateService } from '../helper/donate/donate.service'
import { NotificationComponent } from '../notification/notification.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    DonateComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  page: number = 0
  user!: { name: string; email: string }
  hasHelper!: boolean
  helpers: Helper[] = []
  currentHelper!: Helper
  donateModal!: boolean

  constructor(
    private router: Router,
    private modalService: DonateService,
    private http: HttpService,
    private notification: NotificationComponent
  ) {}

  openModal(userDestination: string) {
    this.modalService.openModal(userDestination)
  }

  logout() {
    localStorage.clear()
    this.notification.showSuccess('Deslogado com sucesso')
    this.router.navigate(['/'])
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user')!

    if (!user) {
      this.logout()
    }

    this.user = JSON.parse(user)

    this.search()
  }

  search() {
    this.http.getHelpers(10).subscribe(
      (response) => {
        this.helpers = response.helpers
        this.hasHelper = response.helpers.length > 0
      },
      (error) => {
        console.error(error)
      }
    )
  }

  setPage(number: number) {
    this.page = number
  }

  donateIndex: number | null = null

  setDonate(status: boolean, index: number, helper: Helper): void {
    this.donateIndex = status ? index : null
    this.currentHelper = helper
  }

  donate(helper: Helper) {
    this.openModal(helper.id)
  }

  createHelper() {
    this.router.navigate(['/add/helper'])
  }
}
