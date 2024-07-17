import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { HttpService } from '../http/http.service'
import { UserService } from '../user/user.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  emailForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private userService: UserService
  ) {}

  navigateTo(component: string) {
    this.router.navigate([`/${component}`])
  }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', [Validators.required]]
    })
  }

  async onSubmit() {
    if (this.emailForm.valid) {
      const userLogin = {
        email: this.emailForm.get('email')?.value,
        password: this.emailForm.get('password')?.value
      }

      this.http.login(userLogin).subscribe(
        (response) => {
          // this.notification.notify()
          console.log(response)
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          this.navigateTo('/home')
        },
        (error) => {
          console.error(error)
        }
      )
    } else {
      //  this.notification.notify("Dados incorretos")
    }
  }
}
