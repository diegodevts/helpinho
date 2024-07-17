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
import { UserDto } from '../../../../shared/dtos/user/user.dto'
import { HttpClientModule } from '@angular/common/http'
import { NotificationComponent } from '../notification/notification.component'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  submitted!: boolean

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private notification: NotificationComponent
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', [Validators.required]],
      phone: ['', Validators.required]
    })
  }

  navigateTo(component: string) {
    this.router.navigate([`/${component}`])
  }

  async onSubmit() {
    this.submitted = true

    if (this.registerForm.valid) {
      const user: UserDto = {
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        phone: this.registerForm.get('phone')?.value
      }

      this.http.createUser(user).subscribe(
        (response) => {
          this.notification.showSuccess('Registrado com sucesso!')

          this.submitted = false
        },
        (error) => {
          console.error(error)
          this.submitted = false
        }
      )

      this.navigateTo('')
    } else {
      this.notification.showError('Existem campos vazios')
    }
  }

  get f() {
    return this.registerForm.controls
  }
}
